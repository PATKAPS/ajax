const enterButton = document.getElementById('enter-button');
const mobileFooter = document.getElementById('mobile-footer');
const weaponContainer = document.getElementById('weapon-container');
const specificWeaponContainer = document.getElementById('specific-weapon-container')
const specificSkinContainer = document.getElementById('specific-skin-container')
const specificChromaContainer = document.getElementById('specific-chroma-container')
const landingContainer = document.getElementById('landing-container')

const enterSite = () => {
    landingContainer.classList.add('hidden');
    mobileFooter.classList.remove('hidden');
    weaponContainer.classList.remove('hidden');
    getWeaponData().then(populateWeaponContainer);
}

enterButton.addEventListener('click', enterSite);

const baseUrl = 'https://valorant-api.com/v1';

const getWeaponData = async () => {
    const weaponEndpoint = '/weapons';
    const urlToFetch = `${baseUrl}${weaponEndpoint}`;
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            const weaponData = jsonResponse.data;
            return weaponData
        }
    }
    catch(Error) {
        console.log(Error)
    }
}

const populateWeaponContainer = (weaponData) => {
    const weaponsContainer = document.createElement('div');
    weaponsContainer.classList.add('skin-container')
    weaponContainer.appendChild(weaponsContainer)

    for (const weapon of weaponData) {
        let weaponImgContainer = document.createElement('div');
        weaponImgContainer.classList.add('weapon-image-container', `${weapon.displayName}`);
        weaponsContainer.appendChild(weaponImgContainer);
        let weaponImg = document.createElement('img');
        weaponImg.classList.add('weapon-image');
        weaponImg.src = `${weapon.displayIcon}`;
        weaponImgContainer.appendChild(weaponImg);
        weaponImgContainer.addEventListener('click', () => {
            getSpecificWeaponData(weapon)
        })
    }

}

const getSpecificWeaponData = (weapon) => {
    weaponContainer.classList.add('hidden')
    specificWeaponContainer.classList.remove('hidden')
    const weaponNameContainer = document.createElement('div');
    weaponNameContainer.classList.add('weapon-name-container');
    specificWeaponContainer.appendChild(weaponNameContainer);
    const weaponName = document.createElement('h2');
    weaponName.classList.add('weapon-name');
    weaponName.innerHTML = `${weapon.displayName}`;
    weaponNameContainer.appendChild(weaponName);
    const skinsContainer = document.createElement('div');
    skinsContainer.classList.add('skin-container');
    specificWeaponContainer.appendChild(skinsContainer);
    for (const skin of weapon.skins) {
        if (skin.contentTierUuid && skin.displayIcon) {
        const skinImgContainer = document.createElement('div')
        skinImgContainer.classList.add('weapon-image-container')
        skinsContainer.appendChild(skinImgContainer)
        const skinImg = document.createElement('img')
        skinImg.classList.add('weapon-image')
        skinImg.src = `${skin.displayIcon}`
        skinImgContainer.appendChild(skinImg)
        skinImgContainer.addEventListener('click', () => {
            getSkinData(skin)
        })
        }
    }
}

const getSkinData = (skin) => {
    specificWeaponContainer.classList.add('hidden')
    specificSkinContainer.classList.remove('hidden')
    const weaponNameContainer = document.createElement('div');
    weaponNameContainer.classList.add('weapon-name-container');
    specificSkinContainer.appendChild(weaponNameContainer);
    const skinHeader = document.createElement('h2')
    skinHeader.classList.add('weapon-name')
    skinHeader.innerHTML = `${skin.displayName}`
    weaponNameContainer.appendChild(skinHeader);
    const skinContainer = document.createElement('div')
    skinContainer.classList.add('chroma-container')
    specificSkinContainer.appendChild(skinContainer)
    const skinVideoContainer = document.createElement('div')
    skinVideoContainer.classList.add('video-container')
    skinContainer.appendChild(skinVideoContainer)
    const skinVideo = document.createElement('video')
    skinVideo.classList.add('chroma-video')
    skinVideo.setAttribute('controls', true)
    skinVideo.setAttribute('autoplay', true)
    skinVideo.volume = 0.25;
    skinVideoContainer.appendChild(skinVideo)
    const skinVideoSource = document.createElement('source')
    skinVideoSource.src = `${skin.levels[(skin.levels.length - 1)].streamedVideo}`
    skinVideo.appendChild(skinVideoSource)
    // const chromaContainer = document.createElement('div')
    // chromaContainer.classList.add('chroma-container')
    // specificChromaContainer.appendChild(chromaContainer)
    const chromaNameContainer = document.createElement('div')
    chromaNameContainer.classList.add('weapon-name-container')
    skinContainer.appendChild(chromaNameContainer)
    const chromaName = document.createElement('h4')
    chromaName.classList.add('weapon-name')
    chromaName.innerHTML = `${skin.displayName} Chromas`;
    chromaNameContainer.appendChild(chromaName)
    for (let i = 1; i < skin.chromas.length; i++) {
        let chroma = skin.chromas[i]
        const skinImgContainer = document.createElement('div')
        skinImgContainer.classList.add('skin-full-image-container')
        skinContainer.appendChild(skinImgContainer)
        const skinImg = document.createElement('img')
        skinImg.classList.add('weapon-image')
        skinImg.src = `${chroma.fullRender}`
        skinImgContainer.appendChild(skinImg)
        skinImgContainer.addEventListener('click', () => {
            getChromaData(chroma)
        })
        skinImgContainer.addEventListener('click', () => {
            pauseVideo(skinVideo)
        })
    }

}

const pauseVideo = (skinVideo) => {
    skinVideo.pause()
}

const getChromaData = (chroma) => {
    specificSkinContainer.classList.add('hidden')
    specificChromaContainer.classList.remove('hidden')
    const chromaNameContainer = document.createElement('div')
    chromaNameContainer.classList.add('weapon-name-container')
    specificChromaContainer.appendChild(chromaNameContainer)
    const chromaHeader = document.createElement('h2')
    chromaHeader.classList.add('weapon-name')
    chromaHeader.innerHTML = `${chroma.displayName}`
    chromaNameContainer.appendChild(chromaHeader)
    const chromaVideoContainer = document.createElement('div')
    chromaVideoContainer.classList.add('video-container')
    specificChromaContainer.appendChild(chromaVideoContainer)
    if (chroma.streamedVideo) {
    const chromaVideo = document.createElement('video')
    chromaVideo.classList.add('chroma-video')
    chromaVideo.setAttribute('controls', true)
    chromaVideo.setAttribute('autoplay', true)
    chromaVideo.volume = 0.25;
    chromaVideoContainer.appendChild(chromaVideo)
    const chromaVideoSource = document.createElement('source')
    chromaVideoSource.src = `${chroma.streamedVideo}`
    chromaVideo.appendChild(chromaVideoSource)
    } else {
        const nullVideoImg = document.createElement('img')
        nullVideoImg.classList.add('weapon-image')
        nullVideoImg.src = 'https://i.redd.it/h044s6irkmr81.png'
        chromaVideoContainer.appendChild(nullVideoImg)
        const nullVideo = document.createElement('h3')
        nullVideo.innerHTML = 'Sorry, video for this skin does not exist'
        chromaVideoContainer.appendChild(nullVideo)
    }
}