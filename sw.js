// 캐시 이름 정의
const CACHE_NAME = 'samjinout-cache-v1';

// 캐시할 파일 목록
const urlsToCache = [
  '/',
  '/index.html',
  '/icon.png',
  '/manifest.json'
];

// 서비스 워커 설치 이벤트
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('캐시 열기 성공');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.error('캐시 addAll 실패:', error);
        // 캐시 실패시에도 서비스워커 설치 계속 진행
        return Promise.resolve();
      })
  );
});

// 서비스 워커 활성화 이벤트 (캐시 정리)
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 캐시에 있으면 캐시된 응답 반환
        if (response) {
          return response;
        }
        
        // 없으면 네트워크 요청
        return fetch(event.request).then(
          function(response) {
            // 유효한 응답이 아니면 그냥 반환
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 응답 복제 (스트림은 한 번만 사용 가능)
            var responseToCache = response.clone();
            
            // 캐시에 응답 저장
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});
