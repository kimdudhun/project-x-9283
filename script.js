// 페이지 로드 애니메이션
document.addEventListener('DOMContentLoaded', () => {
    // 카테고리 탭 필터 기능
    const tabs = document.querySelectorAll('.category-tab');
    const cards = document.querySelectorAll('.card');
    
    // 필터링 함수
    function filterCards(category) {
        cards.forEach(card => {
            if (category === 'all') {
                // All 카테고리는 모든 카드 표시
                card.style.display = 'flex';
            } else {
                const cardCategories = card.getAttribute('data-category');
                // 카테고리가 여러 개일 수 있으므로 공백으로 분리하여 확인
                if (cardCategories && cardCategories.split(' ').includes(category)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // 활성 탭 변경
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 카드 필터링
            filterCards(category);
        });
    });
    
    // 초기 로드 시 All 카테고리 표시
    filterCards('all');
    
    // 카드 호버 시 주변 카드 살짝 이동 효과
    const hoverCards = document.querySelectorAll('.card:not(.card-disabled)');
    
    hoverCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            hoverCards.forEach(otherCard => {
                if (otherCard !== card) {
                    const rect1 = card.getBoundingClientRect();
                    const rect2 = otherCard.getBoundingClientRect();
                    
                    const dx = rect2.left - rect1.left;
                    const dy = rect2.top - rect1.top;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 400) {
                        const angle = Math.atan2(dy, dx);
                        const pushDistance = Math.max(0, (400 - distance) / 400) * 5;
                        const pushX = Math.cos(angle) * pushDistance;
                        const pushY = Math.sin(angle) * pushDistance;
                        
                        otherCard.style.transform = `translate(${pushX}px, ${pushY}px)`;
                    }
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            hoverCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.transform = '';
                }
            });
        });
    });

    // 비활성화된 카드 클릭 시 알림
    const disabledCards = document.querySelectorAll('.card-disabled');
    
    disabledCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 카드 흔들기 애니메이션
            card.style.animation = 'shake 0.5s';
            
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
            
            // 간단한 알림 표시
            showNotification('이 도구는 곧 출시될 예정입니다! 🚀');
        });
    });

    // 스크롤 시 헤더 페이드 효과
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.style.transform = `translateY(-${Math.min(currentScroll / 10, 20)}px)`;
            header.style.opacity = Math.max(1 - currentScroll / 300, 0.5);
        } else {
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
        }
        
        lastScroll = currentScroll;
    });

    // 키보드 네비게이션 개선
    const allCards = document.querySelectorAll('.card');
    allCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
            
            // 화살표 키로 카드 간 이동
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextCard = allCards[Math.min(index + 1, allCards.length - 1)];
                nextCard.focus();
            }
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevCard = allCards[Math.max(index - 1, 0)];
                prevCard.focus();
            }
        });
    });

    // 마우스 추적 효과
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 배경에 미묘한 패럴랙스 효과
        const moveX = (mouseX - window.innerWidth / 2) / 50;
        const moveY = (mouseY - window.innerHeight / 2) / 50;
        
        document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
    });

    // 페이지 가시성 변경 시 애니메이션 제어
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 페이지가 숨겨졌을 때 애니메이션 일시 정지
            document.body.style.animationPlayState = 'paused';
        } else {
            // 페이지가 다시 보일 때 애니메이션 재개
            document.body.style.animationPlayState = 'running';
        }
    });
});

// 흔들기 애니메이션
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// 알림 표시 함수
function showNotification(message) {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // 알림 스타일
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%) translateY(-100px)',
        background: 'rgba(255, 255, 255, 0.95)',
        color: '#2d3748',
        padding: '15px 30px',
        borderRadius: '50px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        zIndex: '1000',
        fontSize: '1rem',
        fontWeight: '600',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        pointerEvents: 'none'
    });
    
    document.body.appendChild(notification);
    
    // 애니메이션으로 표시
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// 성능 최적화: Intersection Observer로 카드 애니메이션 제어
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

// 이스터 에그: 콘솔에 환영 메시지
console.log('%c🎨 AI Design Tools Hub', 'font-size: 24px; font-weight: bold; color: #667eea;');
console.log('%c환영합니다! 이 사이트는 AI 디자인 워크플로우를 위해 만들어졌습니다.', 'font-size: 14px; color: #764ba2;');
console.log('%c개발자 도구를 열어주셔서 감사합니다! 😊', 'font-size: 12px; color: #f093fb;');
