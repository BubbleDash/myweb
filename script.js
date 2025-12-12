// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题
    initTheme();
    
    // 初始化导航菜单
    initNavigation();
    
    // 初始化图片查看器
    initImageViewer();
    
    // 初始化漫画阅读器
    initComicReader();
    
    // 加载示例数据
    loadSampleData();
    
    // 初始化懒加载
    initLazyLoading();
});

// 初始化主题切换功能
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // 从localStorage获取保存的主题
    const savedTheme = localStorage.getItem('theme');
    
    // 如果有保存的主题，应用它
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else {
        // 默认使用浅绿嫩黄主题
        body.setAttribute('data-theme', 'light');
    }
    
    // 添加主题切换事件监听
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'red-black' : 'light';
        
        // 应用新主题
        body.setAttribute('data-theme', newTheme);
        
        // 保存主题到localStorage
        localStorage.setItem('theme', newTheme);
    });
}

// 初始化导航菜单
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 移动端汉堡菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 点击导航链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 计算滚动位置，考虑固定导航栏的高度
                const offsetTop = targetElement.offsetTop - 80;
                
                // 平滑滚动
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 初始化图片查看器
function initImageViewer() {
    const imageViewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const viewerCaption = document.getElementById('viewerCaption');
    const closeViewer = document.getElementById('closeViewer');
    
    // 打开图片查看器
    window.openImageViewer = function(imageSrc, caption) {
        viewerImage.src = imageSrc;
        viewerCaption.textContent = caption;
        imageViewer.classList.add('active');
        
        // 阻止背景滚动
        document.body.style.overflow = 'hidden';
    };
    
    // 关闭图片查看器
    function closeImageViewer() {
        imageViewer.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // 点击关闭按钮
    closeViewer.addEventListener('click', closeImageViewer);
    
    // 点击模态框外部关闭
    imageViewer.addEventListener('click', function(e) {
        if (e.target === imageViewer) {
            closeImageViewer();
        }
    });
    
    // 按ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageViewer.classList.contains('active')) {
            closeImageViewer();
        }
    });
}

// 初始化漫画阅读器
function initComicReader() {
    const comicReader = document.getElementById('comicReader');
    const closeComic = document.getElementById('closeComic');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const comicContainer = document.getElementById('comicContainer');
    
    let currentComic = null;
    let currentPage = 0;
    
    // 打开漫画阅读器
    window.openComicReader = function(comic) {
        currentComic = comic;
        currentPage = 0;
        
        // 渲染当前页面
        renderComicPage();
        
        // 显示阅读器
        comicReader.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // 渲染漫画页面
    function renderComicPage() {
        if (!currentComic || currentPage < 0 || currentPage >= currentComic.pages.length) {
            return;
        }
        
        // 清空容器
        comicContainer.innerHTML = '';
        
        // 创建图片元素
        const img = document.createElement('img');
        img.src = currentComic.pages[currentPage];
        img.alt = `${currentComic.title} - 第${currentPage + 1}页`;
        
        // 添加图片加载失败处理
        img.onerror = function() {
            this.classList.add('error');
            this.alt = '图片加载失败';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.textContent = '图片加载失败';
        };
        
        // 添加到容器
        comicContainer.appendChild(img);
        
        // 更新页码信息
        pageInfo.textContent = `${currentPage + 1} / ${currentComic.pages.length}`;
    }
    
    // 上一页
    function goToPrevPage() {
        if (currentPage > 0) {
            currentPage--;
            renderComicPage();
        }
    }
    
    // 下一页
    function goToNextPage() {
        if (currentComic && currentPage < currentComic.pages.length - 1) {
            currentPage++;
            renderComicPage();
        }
    }
    
    // 关闭漫画阅读器
    function closeComicReader() {
        comicReader.classList.remove('active');
        document.body.style.overflow = 'auto';
        currentComic = null;
        currentPage = 0;
    }
    
    // 事件监听
    prevPage.addEventListener('click', goToPrevPage);
    nextPage.addEventListener('click', goToNextPage);
    closeComic.addEventListener('click', closeComicReader);
    
    // 点击模态框外部关闭
    comicReader.addEventListener('click', function(e) {
        if (e.target === comicReader) {
            closeComicReader();
        }
    });
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (!comicReader.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            goToPrevPage();
        } else if (e.key === 'ArrowRight') {
            goToNextPage();
        } else if (e.key === 'Escape') {
            closeComicReader();
        }
    });
}

// 加载示例数据
function loadSampleData() {
    // 同人创作示例数据
    const doujinData = [
        { id: 1, title: '伊布家族', source: 'Pokémon', image: 'bkm.jpg' },
        { id: 2, title: '地狱客栈', source: 'Hazbin Hotel', image: 'hh.jpg' },
        { id: 3, title: 'Mygo', source: '少女乐队', image: 'mg.jpg' },
        { id: 4, title: '废墟图书馆', source: 'ProjectMoon月亮计划', image: 'fxdd.jpg' },
        { id: 5, title: '脑叶公司', source: 'ProjectMoon月亮计划', image: 'yxt.jpg' },
        { id: 6, title: '边狱巴士', source: 'ProjectMoon月亮计划', image: 'bysl.jpg' },
        { id: 7, title: 'RPG', source: 'RPG大杂烩', image: 'https://via.placeholder.com/400x300/8BC34A/2E7D32?text=Magical+Girl' },
        { id: 8, title: '动画', source: '动画大杂烩', image: 'https://via.placeholder.com/400x300/8BC34A/2E7D32?text=Magical+Girl' },
    ];
    
    // 独立游戏示例数据
    const gamesData = [
        {
            id: 1,
            title: '囚于时空中的少女们demo ver.1.0',
            type: ['互动小说', '角色扮演','科幻', '末日','情感','7天轮回','多周目'],
            updated: '2025-11-21',
            image: 'xingyueB.jpg',
        },
        {
            id: 2,
            title: '美少女与永恒轮转奏鸣曲demo ver.2.0',
            type: ['互动小说', '恐怖','恋爱','惊悚','AI','多结局'],
            updated: '2025-11-21',
            image: 'https://via.placeholder.com/100x100/E53935/FFFFFF?text=游戏1'
        },
        {
            id: 3,
            title: '病娇数据库污染了你的恋人AI',
            type: ['互动小说', '恐怖','恋爱','惊悚','AI','多结局'],
            updated: '2025-11-21',
            image: 'https://via.placeholder.com/100x100/E53935/FFFFFF?text=游戏1'
        },
        {
            id: 4,
            title: '山海异兽-恐怖欧庄豪宅',
            type: ['像素RPG','角色扮演','恐怖', '解谜', '伦理扭曲','怪物','小女孩'],
            updated: '2025-11-21',
            image: 'https://via.placeholder.com/100x100/E53935/FFFFFF?text=游戏1'
        },
        {
            id: 5,
            title: '幽灵的暴风雪山庄',
            type: ['视觉小说','解谜','旁观者模式','角色观察'],
            updated: '2023-11-15',
            image: 'https://via.placeholder.com/100x100/E53935/FFFFFF?text=游戏2'
        },
        {
            id: 6,
            title: '恐怖互动',
            type: '互动解谜',
            updated: '2023-11-08',
            image: '' // 无图片，使用默认占位图
        },
        {
            id: 76,
            title: 'xxxx',
            type: '视觉小说',
            updated: '2023-11-05',
            image: '' // 无图片，使用默认占位图
        }
    ];
    
    // only活动示例数据
    const onlyData = [
        {
            id: 1,
            title: '镜花水月1.0',
            type: '同好聚会',
            updated: '已结束',//活动状态
            image: 'DSC_0879.JPG'
        },
        {
            id: 2,
            title: '镜花水月1.5——往昔小憩',
            type: '同好cafe',
            updated: '预热中',
            image: 'phone_wxxq_cafe.jpg'
        },
        {
            id: 3,
            title: '欧美AG——欧美动漫游戏only',
            type: '综合',
            updated: '未开始',
            image: 'https://via.placeholder.com/100x100/E53935/FFFFFF?text=游戏2'
        },
        {
            id: 4,
            title: '镜花水月2.0',
            type: '同好聚会',
            updated: '筹备中',
            image: '' // 无图片，使用默认占位图
        },
        {
            id: 5,
            title: 'xxxx',
            type: 'xxx',
            updated: '未知',
            image: '' // 无图片，使用默认占位图
        }
    ];

    // 原创OC示例数据
    const ocData = [
        {
            id: 1,
            name: '绒绒',
            bio: '异世界新人玩家，为了拯救青梅不惜以身入局，但似乎隐瞒着更核心的目的。温柔的科研天才，却于虚构世界反复再临的末日浩劫中不断寻回与失去，一步、一步地接近扑朔迷离的真相…',
            image: 'https://via.placeholder.com/400x400/8BC34A/2E7D32?text=White+Night',
            details: {
                '年龄': '18',
                '性别': '女',
                '能力': '代价预言系统',
                '性格': '理智、坚韧'
            }
        },
        {
            id: 2,
            name: '吴晓',
            bio: '异世界新人玩家，为了拯救青梅不惜以身入局，但似乎隐瞒着更核心的目的。温柔的科研天才，却于虚构世界反复再临的末日浩劫中不断寻回与失去，一步、一步地接近扑朔迷离的真相…',
            image: 'https://via.placeholder.com/400x400/8BC34A/2E7D32?text=White+Night',
            details: {
                '年龄': '似乎20来岁',
                '性别': '女',
                '能力': '代价预言系统',
                '性格': '理智、坚韧'
            }
        },
        {
            id: 3,
            name: '吴晓',
            bio: '异世界新人玩家，为了拯救青梅不惜以身入局，但似乎隐瞒着更核心的目的。温柔的科研天才，却于虚构世界反复再临的末日浩劫中不断寻回与失去，一步、一步地接近扑朔迷离的真相…',
            image: 'https://via.placeholder.com/400x400/8BC34A/2E7D32?text=White+Night',
            details: {
                '年龄': '似乎20来岁',
                '性别': '女',
                '能力': '代价预言系统',
                '性格': '理智、坚韧'
            }
        },
        // {
        //     id: 4,
        //     name: '吴晓',
        //     bio: '异世界新人玩家，为了拯救青梅不惜以身入局，但似乎隐瞒着更核心的目的。温柔的科研天才，却于虚构世界反复再临的末日浩劫中不断寻回与失去，一步、一步地接近扑朔迷离的真相…',
        //     image: 'https://via.placeholder.com/400x400/8BC34A/2E7D32?text=White+Night',
        //     details: {
        //         '年龄': '似乎20来岁',
        //         '性别': '女',
        //         '能力': '代价预言系统',
        //         '性格': '理智、坚韧'
        //     }
        // },
        // {
        //     id: 5,
        //     name: '美少年(？赫连绯)',
        //     bio: '优雅的诱惑者，一个以自我中心的梦想家，能够用能力操控情感。隐藏了自己的真实身份，暗中建造着某个违反游戏规则的疯狂项目。',
        //     image: 'https://via.placeholder.com/400x400/8BC34A/2E7D32?text=Pianist',
        //     details: {
        //         '年龄': '8（全员一致认同）',
        //         '性别': '男',
        //         '能力': '氛围滤镜',
        //         '性格': '优雅高傲、残忍天真'
        //     }
        // },
        // {
        //     id: 6,
        //     name: '磊星月',
        //     bio: '资历颇深的异世界旅行者，拥有强大的精神力量，与脆弱不安的生命，却为了陪伴最重要的人孤注一掷地守护。',
        //     image: 'https://via.placeholder.com/400x400/8BC34A/2E7D32?text=Angela',
        //     details: {
        //         '年龄': '？？？',
        //         '性别': '女',
        //         '能力': '痛苦同步,',
        //         '性格': '阳光善良、争强好胜'
        //     }
        // }
    ];
    
    // 原创漫画示例数据
    const comicsData = [
        {
            id: 1,
            title: 'xxxxx',
            type: ['日常', '番外', '校园'],
            updated: '2025-12-05',
            image: 'https://via.placeholder.com/100x100/8BC34A/2E7D32?text=漫画1',
            pages: [
                'https://via.placeholder.com/800x1200/8BC34A/2E7D32?text=Page+1',
                'https://via.placeholder.com/800x1200/8BC34A/2E7D32?text=Page+2',
                'https://via.placeholder.com/800x1200/8BC34A/2E7D32?text=Page+3'
            ]
        },
        {
            id: 2,
            title: 'xxxxxx',
            type: ['奇幻', '冒险', '魔法'],
            updated: '2025-12-02',
            image: 'https://via.placeholder.com/100x100/8BC34A/2E7D32?text=漫画2',
            pages: [
                'https://via.placeholder.com/800x1200/8BC34A/2E7D32?text=Page+1',
                'https://via.placeholder.com/800x1200/8BC34A/2E7D32?text=Page+2'
            ]
        },
        {
            id: 3,
            title: 'xxxxxx',
            type: ['日常', '恋爱', '治愈'],
            updated: '2025-11-23',
            image: 'https://via.placeholder.com/100x100/8BC34A/2E7D32?text=漫画3',
            pages: [
                'https://via.placeholder.com/800x1200/8BC34A/2E7D32?text=Page+1',
                'https://via.placeholder.com/800x1200/8BC34A/2E7D32?text=Page+2',
                'https://via.placeholder.com/800x1200/8BC34A/2E7D32?text=Page+3',
                'https://via.placeholder.com/800x1200/8BC34A/2E7D32?text=Page+4'
            ]
        }
    ];
    
    // 渲染同人创作画廊
    renderDoujinGallery(doujinData);
    
    // 渲染独立游戏列表
    renderGamesList(gamesData);

    //渲染only举办列表
    renderOnlyList(onlyData);
    
    // 渲染原创OC列表
    renderOCList(ocData);
    
    // 渲染原创漫画列表
    renderComicsList(comicsData);
}

// 渲染同人创作画廊
function renderDoujinGallery(data) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    
    data.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        // 创建图片元素
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        img.loading = 'lazy'; // 懒加载
        
        // 图片加载失败处理
        img.onerror = function() {
            this.classList.add('error');
            this.alt = '图片加载失败';
        };
        
        // 创建说明文字
        const caption = document.createElement('div');
        caption.className = 'gallery-caption';
        caption.innerHTML = `<h3>${item.title}</h3><p>出自：${item.source}</p>`;
        
        // 添加到画廊项
        galleryItem.appendChild(img);
        galleryItem.appendChild(caption);
        
        // 点击事件：打开图片查看器
        galleryItem.addEventListener('click', function() {
            window.openImageViewer(item.image, `${item.title} (出自：${item.source})`);
        });
        
        // 添加到画廊
        gallery.appendChild(galleryItem);
    });
}

// 渲染独立游戏列表
function renderGamesList(data) {
    const container = document.querySelector('.games-container');
    container.innerHTML = '';
    
    // 默认占位图
    const defaultImages = [
        'https://via.placeholder.com/100x100/8BC34A/2E7D32?text=游戏',
        'https://via.placeholder.com/100x100/E53935/FFFFFF?text=GAME'
    ];
    
    // 按更新时间倒序排列
    const sortedData = [...data].sort((a, b) => new Date(b.updated) - new Date(a.updated));
    
    sortedData.forEach((item, index) => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        
        // 解析图片数据（支持对象格式和字符串格式）
        let mainImage, hoverImage;
        if (typeof item.image === 'object' && item.image !== null) {
            mainImage = item.image.main || defaultImages[index % defaultImages.length];
        } else {
            mainImage = item.image || defaultImages[index % defaultImages.length];
            hoverImage = null;
        }
        
        // 生成类型标签HTML
        let typeTagsHTML = '';
        if (Array.isArray(item.type)) {
            item.type.forEach(type => {
                typeTagsHTML += `<span class="game-type">${type}</span>`;
            });
        } else {
            // 兼容单个类型的情况
            typeTagsHTML = `<span class="game-type">${item.type}</span>`;
        }
        
        // 构建卡片HTML
        gameCard.innerHTML = `
            <div class="game-icon">
                <img src="${mainImage}" alt="${item.title}图标" loading="lazy">
            </div>
            ${typeTagsHTML}
            <h3>${item.title}</h3>
            <p class="game-updated">最后更新：${item.updated}</p>
            <button class="game-btn" onclick="alert('游戏详情页开发中')">游戏详情</button>
        `;
        
        // 添加图片hover切换效果
        if (hoverImage) {
            const imgElement = gameCard.querySelector('.game-icon img');
            let originalSrc = mainImage;
            
            gameCard.addEventListener('mouseenter', () => {
                imgElement.src = hoverImage;
            });
            
            gameCard.addEventListener('mouseleave', () => {
                imgElement.src = originalSrc;
            });
        }
        
        // 添加到容器
        container.appendChild(gameCard);
    });
}

// 渲染only举办列表
function renderOnlyList(data) {
    const container = document.querySelector('.only-container');
    container.innerHTML = '';
    
    // 默认占位图
    const defaultImages = [
        'https://via.placeholder.com/100x100/8BC34A/2E7D32?text=游戏',
        'https://via.placeholder.com/100x100/E53935/FFFFFF?text=GAME'
    ];
    
    // 按更新时间倒序排列
    const sortedData = [...data].sort((a, b) => new Date(b.updated) - new Date(a.updated));
    
    sortedData.forEach((item, index) => {
        const onlyCard = document.createElement('div');
        onlyCard.className = 'only-card';
        
        // 选择图片或默认占位图
        const imageSrc = item.image || defaultImages[index % defaultImages.length];
        
        // 构建卡片HTML
        onlyCard.innerHTML = `
            <div class="only-icon">
                <img src="${imageSrc}" alt="${item.title}图标" loading="lazy">
            </div>
            <span class="only-type">${item.type}</span>
            <h3>${item.title}</h3>
            <p class="only-updated">状态：${item.updated}</p>
            <button class="only-btn" onclick="alert('only信息完善中')">ONLY详情</button>
        `;
        
        // 添加到容器
        container.appendChild(onlyCard);
    });
}

// 渲染原创OC列表
function renderOCList(data) {
    const container = document.querySelector('.oc-container');
    container.innerHTML = '';
    
    data.forEach(item => {
        const ocCard = document.createElement('div');
        ocCard.className = 'oc-card';
        
        // 构建详情HTML
        let detailsHtml = '';
        for (const [key, value] of Object.entries(item.details)) {
            detailsHtml += `
                <div class="oc-detail-item">
                    <span class="oc-detail-label">${key}</span>
                    <span class="oc-detail-value">${value}</span>
                </div>
            `;
        }
        
        // 构建卡片HTML
        ocCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="oc-image" loading="lazy">
            <div class="oc-info">
                <h3>${item.name}</h3>
                <p class="oc-bio">${item.bio}</p>
                <div class="oc-details">
                    ${detailsHtml}
                </div>
            </div>
        `;
        
        // 添加到容器
        container.appendChild(ocCard);
    });
}

// 渲染原创漫画列表
function renderComicsList(data) {
    const container = document.querySelector('.comics-container');
    container.innerHTML = '';
    
    // 按更新时间倒序排列
    const sortedData = [...data].sort((a, b) => new Date(b.updated) - new Date(a.updated));
    
    sortedData.forEach(item => {
        const comicCard = document.createElement('div');
        comicCard.className = 'comic-card';
        
        // 生成类型标签HTML
        let typeTagsHTML = '';
        if (Array.isArray(item.type)) {
            item.type.forEach(type => {
                typeTagsHTML += `<span class="comic-type">${type}</span>`;
            });
        } else {
            // 兼容单个类型的情况
            typeTagsHTML = `<span class="comic-type">${item.type}</span>`;
        }
        
        // 构建卡片HTML
        comicCard.innerHTML = `
            <div class="comic-cover">
                <img src="${item.image}" alt="${item.title}封面" loading="lazy">
            </div>
            ${typeTagsHTML}
            <h3>${item.title}</h3>
            <p class="comic-updated">最后更新：${item.updated}</p>
            <button class="comic-btn" onclick="window.openComicReader(${JSON.stringify(item).replace(/"/g, '&quot;')})">阅读漫画</button>
        `;
        
        // 添加到容器
        container.appendChild(comicCard);
    });
}

// 初始化懒加载
function initLazyLoading() {
    // 现代浏览器原生支持lazy loading，我们已经在img标签中添加了loading="lazy"
    // 这里添加一个简单的回退方案，以防浏览器不支持
    if ('loading' in HTMLImageElement.prototype) {
        // 浏览器支持原生懒加载
        console.log('浏览器支持原生图片懒加载');
    } else {
        // 回退方案：使用Intersection Observer API
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src || image.src;
                    image.removeAttribute('loading');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    }
}

// 图片加载错误处理
document.addEventListener('error', function(e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        e.target.classList.add('error');
        e.target.alt = '图片加载失败';
        e.target.title = '图片加载失败';
    }
}, true);

// 平滑滚动
function smoothScrollTo(element, duration = 800) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    // 缓动函数
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// 添加页面加载动画
window.addEventListener('load', function() {
    // 页面加载完成后移除加载动画
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'none';
    }
    
    // 添加元素加载动画
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideIn 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

// 初始化互动桌宠
function initPet() {
    const pet = document.getElementById('pet');
    const petImage = pet.querySelector('.pet-image');
    let isDragging = false;
    let offsetX, offsetY;

    // 添加点击互动效果
    pet.addEventListener('click', function() {
        petImage.classList.add('interactive');
        
        // 一段时间后恢复原状
        setTimeout(() => {
            petImage.classList.remove('interactive');
        }, 1000);
    });

    // 初始化拖拽功能
    pet.addEventListener('mousedown', function(e) {
        isDragging = true;
        pet.classList.add('dragging');
        
        // 计算鼠标相对于元素左上角的偏移量
        offsetX = e.clientX - pet.offsetLeft;
        offsetY = e.clientY - pet.offsetTop;
        
        // 添加互动效果
        petImage.classList.add('interactive');
        
        // 阻止默认行为，避免文本选择等
        e.preventDefault();
    });

    // 拖拽过程
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        // 计算新的位置
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
        
        // 更新元素位置
        pet.style.left = `${newX}px`;
        pet.style.top = `${newY}px`;
    });

    // 结束拖拽
    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        
        isDragging = false;
        pet.classList.remove('dragging');
        
        // 移除互动效果
        petImage.classList.remove('interactive');
    });

    // 响应式调整
    window.addEventListener('resize', function() {
        // 确保宠物不会被调整窗口后移出视野
        const petRect = pet.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (petRect.right > viewportWidth) {
            pet.style.left = `${viewportWidth - petRect.width - 20}px`;
        }
        
        if (petRect.bottom > viewportHeight) {
            pet.style.top = `${viewportHeight - petRect.height - 20}px`;
        }
        
        if (petRect.left < 0) {
            pet.style.left = '20px';
        }
        
        if (petRect.top < 0) {
            pet.style.top = '20px';
        }
    });
}

// 在DOM加载完成后初始化桌宠
document.addEventListener('DOMContentLoaded', function() {
    initPet();
});

// 监听主题切换事件，确保桌宠图片正确切换
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', function() {
    const petImage = document.getElementById('pet').querySelector('.pet-image');
    petImage.classList.add('interactive');
    
    // 一段时间后恢复原状
    setTimeout(() => {
        petImage.classList.remove('interactive');
    }, 1000);
});