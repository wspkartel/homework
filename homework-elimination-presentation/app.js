// Presentation App JavaScript
class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 10;
        this.isTransitioning = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateProgress();
        this.updateSlideCounter();
        this.updateNavigationButtons();
    }

    initializeElements() {
        // Get DOM elements
        this.slidesContainer = document.getElementById('slidesContainer');
        this.slides = document.querySelectorAll('.slide');
        this.progressFill = document.getElementById('progressFill');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.startBtn = document.getElementById('startBtn');
        
        // Set total slides
        this.totalSlidesSpan.textContent = this.totalSlides;
    }

    bindEvents() {
        // Navigation button events
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.startBtn.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Touch/swipe navigation for mobile
        this.initializeTouchNavigation();

        // Click anywhere to advance (except on buttons)
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-btn') && 
                !e.target.closest('.start-btn') && 
                !e.target.closest('.slide-counter')) {
                this.nextSlide();
            }
        });

        // Prevent context menu on right click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.previousSlide();
        });
    }

    initializeTouchNavigation() {
        let startX = 0;
        let startY = 0;
        let threshold = 100; // Minimum swipe distance

        this.slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        this.slidesContainer.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            let endX = e.changedTouches[0].clientX;
            let endY = e.changedTouches[0].clientY;

            let diffX = startX - endX;
            let diffY = startY - endY;

            // Only handle horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.previousSlide();
                }
            }

            // Reset
            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
            case 'Enter':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'Backspace':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                e.preventDefault();
                this.goToSlide(1);
                break;
            default:
                // Check for number keys (1-9, 0)
                if (e.key >= '1' && e.key <= '9') {
                    e.preventDefault();
                    const slideNumber = parseInt(e.key);
                    if (slideNumber <= this.totalSlides) {
                        this.goToSlide(slideNumber);
                    }
                } else if (e.key === '0') {
                    e.preventDefault();
                    this.goToSlide(10);
                }
                break;
        }
    }

    nextSlide() {
        if (this.isTransitioning) return;
        
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.isTransitioning) return;
        
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (this.isTransitioning || slideNumber === this.currentSlide) return;
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        this.isTransitioning = true;

        // Remove active class from current slide
        const currentSlideElement = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
            
            // Add prev class for transition effect
            if (slideNumber < this.currentSlide) {
                currentSlideElement.classList.add('prev');
            }
        }

        // Update current slide number
        this.currentSlide = slideNumber;

        // Add active class to new slide
        const newSlideElement = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (newSlideElement) {
            // Remove any previous transition classes
            this.slides.forEach(slide => {
                slide.classList.remove('prev');
            });

            // Activate new slide
            setTimeout(() => {
                newSlideElement.classList.add('active');
            }, 50);
        }

        // Update UI elements
        this.updateProgress();
        this.updateSlideCounter();
        this.updateNavigationButtons();

        // Add slide-specific effects
        this.addSlideEffects(slideNumber);

        // Reset transition flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    addSlideEffects(slideNumber) {
        // Remove any existing effects
        document.body.classList.remove('slide-problem', 'slide-action', 'slide-conclusion');

        // Add specific effects based on slide
        switch(slideNumber) {
            case 2: // Problem statement
                document.body.classList.add('slide-problem');
                this.animateStats();
                break;
            case 3: // Research evidence
                this.animateResearchFacts();
                break;
            case 4: // International comparison
                this.animateCountryComparison();
                break;
            case 8: // Benefits
                this.animateBenefits();
                break;
            case 9: // Call to action
                document.body.classList.add('slide-action');
                this.animateActionItems();
                break;
            case 10: // Conclusion
                document.body.classList.add('slide-conclusion');
                this.animateConclusion();
                break;
        }
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.slide[data-slide="2"] .stat-large');
        statNumbers.forEach((stat, index) => {
            const finalValue = parseInt(stat.textContent);
            stat.textContent = '0%';
            
            setTimeout(() => {
                this.animateNumber(stat, 0, finalValue, 1500, '%');
            }, index * 200);
        });
    }

    animateResearchFacts() {
        const factNumbers = document.querySelectorAll('.slide[data-slide="3"] .fact-number');
        factNumbers.forEach((fact, index) => {
            const originalText = fact.textContent;
            fact.style.opacity = '0';
            
            setTimeout(() => {
                fact.style.opacity = '1';
                fact.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    fact.style.transform = 'scale(1)';
                }, 200);
            }, index * 300);
        });
    }

    animateCountryComparison() {
        const countryCards = document.querySelectorAll('.slide[data-slide="4"] .country');
        countryCards.forEach((card, index) => {
            card.style.transform = 'translateY(20px)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, index * 200);
        });
    }

    animateBenefits() {
        const benefitCategories = document.querySelectorAll('.slide[data-slide="8"] .benefit-category');
        benefitCategories.forEach((category, index) => {
            category.style.transform = 'translateY(30px)';
            category.style.opacity = '0';
            
            setTimeout(() => {
                category.style.transition = 'all 0.8s ease';
                category.style.transform = 'translateY(0)';
                category.style.opacity = '1';
            }, index * 300);
        });
    }

    animateActionItems() {
        const actionItems = document.querySelectorAll('.slide[data-slide="9"] .action-item');
        actionItems.forEach((item, index) => {
            item.style.transform = 'translateX(-30px)';
            item.style.opacity = '0';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease';
                item.style.transform = 'translateX(0)';
                item.style.opacity = '1';
            }, index * 150);
        });
    }

    animateConclusion() {
        const finalStats = document.querySelectorAll('.slide[data-slide="10"] .final-stat');
        finalStats.forEach((stat, index) => {
            stat.style.transform = 'scale(0.8)';
            stat.style.opacity = '0';
            
            setTimeout(() => {
                stat.style.transition = 'all 0.8s ease';
                stat.style.transform = 'scale(1)';
                stat.style.opacity = '1';
            }, index * 200);
        });

        // Animate closing statement
        setTimeout(() => {
            const closingStatement = document.querySelector('.slide[data-slide="10"] .closing-statement');
            if (closingStatement) {
                closingStatement.style.transform = 'translateY(20px)';
                closingStatement.style.opacity = '0';
                closingStatement.style.transition = 'all 1s ease';
                
                setTimeout(() => {
                    closingStatement.style.transform = 'translateY(0)';
                    closingStatement.style.opacity = '1';
                }, 100);
            }
        }, 800);
    }

    animateNumber(element, start, end, duration, suffix = '') {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    updateProgress() {
        const progressPercentage = (this.currentSlide / this.totalSlides) * 100;
        this.progressFill.style.width = `${progressPercentage}%`;
    }

    updateSlideCounter() {
        this.currentSlideSpan.textContent = this.currentSlide;
    }

    updateNavigationButtons() {
        // Update previous button
        this.prevBtn.disabled = this.currentSlide === 1;
        
        // Update next button
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Hide start button after first slide
        if (this.currentSlide > 1) {
            this.startBtn.style.display = 'none';
        }
    }

    // Public methods for external control
    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    reset() {
        this.goToSlide(1);
    }
}

// Auto-start functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the presentation
    window.presentation = new PresentationApp();

    // Add loading animation
    document.body.classList.add('loaded');

    // Add some global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // F11 for fullscreen
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
        
        // F5 to restart presentation
        if (e.key === 'F5') {
            e.preventDefault();
            window.presentation.reset();
        }
    });

    // Add click indicators for better UX
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-btn') && 
            !e.target.closest('.start-btn') && 
            !e.target.closest('.slide-counter')) {
            createClickIndicator(e.clientX, e.clientY);
        }
    });

    // Preload any dynamic content
    preloadContent();
});

// Utility functions
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen not supported');
        });
    } else {
        document.exitFullscreen();
    }
}

function createClickIndicator(x, y) {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        border: 2px solid var(--color-primary);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        pointer-events: none;
        z-index: 10000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.style.transform = 'translate(-50%, -50%) scale(1)';
        indicator.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        document.body.removeChild(indicator);
    }, 300);
}

function preloadContent() {
    // Preload chart images
    const chartImages = [
        'https://pplx-res.cloudinary.com/image/upload/v1749401803/pplx_code_interpreter/35cf20af_isrxzy.jpg'
    ];
    
    chartImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Add some CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    body:not(.loaded) .slide {
        opacity: 0;
    }
    
    body.loaded .slide.active {
        opacity: 1;
    }
    
    .slide-problem {
        background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, transparent 100%);
    }
    
    .slide-action {
        background: linear-gradient(135deg, rgba(5, 150, 105, 0.05) 0%, transparent 100%);
    }
    
    .slide-conclusion {
        background: linear-gradient(135deg, rgba(33, 128, 141, 0.05) 0%, transparent 100%);
    }
`;
document.head.appendChild(style);

// Export for potential external use
window.PresentationApp = PresentationApp;