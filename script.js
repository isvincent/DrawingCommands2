
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cardsContainer');
    const searchInput = document.getElementById('searchInput');
    const toast = document.getElementById('toast');
    const clickSound = document.getElementById('clickSound');
    const successSound = document.getElementById('successSound');

    // Function to play sound
    const playSound = (audioElem) => {
        audioElem.currentTime = 0;
        audioElem.play().catch(e => console.log('Audio play failed:', e));
    };

    // Render cards
    const renderCards = (data) => {
        container.innerHTML = '';
        
        if (data.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-ghost"></i>
                    <p>找不到符合的指令或提示詞</p>
                </div>
            `;
            return;
        }

        data.forEach((cmd, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.animationDelay = `${index * 0.05}s`;

            // Using pollinations.ai for image generation based on prompt
            const encodedPrompt = encodeURIComponent(cmd.img_prompt);
            const seed = Math.floor(Math.random() * 100000);
            const imgUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=220&nologo=true&seed=${seed}`;

            card.innerHTML = `
                <div class="card-img-container">
                    <div class="loading-spinner"></div>
                    <img src="${imgUrl}" alt="${cmd.command} 範例" class="card-img" onload="this.previousElementSibling.style.display='none'">
                </div>
                <div class="card-content">
                    <div class="card-title">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        ${cmd.command}
                    </div>
                    <p class="card-desc">${cmd.description}</p>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="copyToClipboard('${cmd.command}', event)">
                            <i class="fa-regular fa-copy"></i> 複製指令
                        </button>
                        <button class="btn btn-secondary" onclick="copyToClipboard('${cmd.description}', event)">
                            <i class="fa-solid fa-align-left"></i> 複製提示詞
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    };

    // Initial render
    renderCards(commandsData);

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = commandsData.filter(cmd => 
            cmd.command.toLowerCase().includes(searchTerm) || 
            cmd.description.toLowerCase().includes(searchTerm)
        );
        renderCards(filteredData);
    });

    // Copy to clipboard function
    window.copyToClipboard = (text, event) => {
        playSound(clickSound);
        
        // Add a small click animation to the button
        const btn = event.currentTarget;
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = 'scale(1)', 150);

        navigator.clipboard.writeText(text).then(() => {
            playSound(successSound);
            showToast();
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

    // Toast notification
    let toastTimeout;
    const showToast = () => {
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    };
});
