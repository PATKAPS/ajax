const enterButton = document.getElementById('enter-button');
const mobileFooter = document.getElementById('mobile-footer');
const weaponContainer = document.getElementById('weapon-container');
const specificWeaponContainer = document.getElementById('specific-weapon-container')
const specificSkinContainer = document.getElementById('specific-skin-container')
const specificChromaContainer = document.getElementById('specific-chroma-container')
const landingContainer = document.getElementById('landing-container')
const homeButton = document.getElementById('home-button')
const myFavoritesButton = document.getElementById('my-favorites-button')
const myFavorites = document.getElementById('my-favorites')
let favorites = []

function storedFavorites() {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i)) {
        favorites.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
        }
    }   
}

const enterSite = () => {
    storedFavorites()
    getWeaponData().then(populateWeaponContainer);
    landingContainer.classList.add('hidden');
    mobileFooter.classList.remove('hidden');
    weaponContainer.classList.remove('hidden');
}

enterButton.addEventListener('click', enterSite);

const goHome = () => {
    weaponContainer.classList.remove('hidden')
    specificWeaponContainer.classList.add('hidden')
    specificWeaponContainer.replaceChildren();
    specificSkinContainer.classList.add('hidden')
    specificSkinContainer.replaceChildren();
    specificChromaContainer.classList.add('hidden')
    specificChromaContainer.replaceChildren();
    myFavorites.classList.add('hidden')
    myFavorites.replaceChildren();
}

homeButton.addEventListener('click', goHome);

const goToFavorites = () => {
    if (myFavorites.classList.contains('hidden')) {
    myFavorites.classList.remove('hidden')
    weaponContainer.classList.add('hidden')
    specificWeaponContainer.classList.add('hidden')
    specificWeaponContainer.replaceChildren();
    specificSkinContainer.classList.add('hidden')
    specificSkinContainer.replaceChildren();
    specificChromaContainer.classList.add('hidden')
    specificChromaContainer.replaceChildren();
    myFavorites.replaceChildren();
    const myFavoritesHeaderContainer = document.createElement('div')
    myFavoritesHeaderContainer.classList.add('weapon-name-container')
    myFavorites.appendChild(myFavoritesHeaderContainer)
    const myFavoritesHeader = document.createElement('h2')
    myFavoritesHeader.innerHTML = 'My Favorites';
    myFavoritesHeaderContainer.appendChild(myFavoritesHeader);
    const myFavoritesContainer = document.createElement('div')
    myFavoritesContainer.classList.add('skin-container')
    myFavorites.appendChild(myFavoritesContainer)
    for (const favorite of favorites)
        if (favorite.fullRender) {
            const weaponImgContainer = document.createElement('div')
            weaponImgContainer.classList.add('weapon-image-container')
            myFavoritesContainer.appendChild(weaponImgContainer)
            const weaponName = document.createElement('h3')
            weaponName.classList.add('weapon-name')
            weaponName.appendChild(document.createTextNode(`${favorite.displayName}`))
            weaponImgContainer.appendChild(weaponName)
            const imgContainer = document.createElement('div')
            imgContainer.classList.add('image-container-height')
            weaponImgContainer.appendChild(imgContainer)
            const weaponImg = document.createElement('img')
            weaponImg.classList.add('weapon-image-height')
            weaponImg.src = `${favorite.fullRender}`
            imgContainer.appendChild(weaponImg)
            const favoriteButtonContainer = document.createElement('div')
            favoriteButtonContainer.classList.add('favorite-button-container')
            weaponImgContainer.appendChild(favoriteButtonContainer)
            const favoriteButton = document.createElement('i')
            favoriteButton.classList.add('fa-regular', 'fa-heart', 'fa-xl')
            const removeFavoriteButton = document.createElement('i')
            removeFavoriteButton.classList.add('fa-solid', 'fa-heart', 'fa-2xl')
            favoriteButtonContainer.appendChild(removeFavoriteButton)
            removeFavoriteButton.addEventListener('click', (event) => {
                removeFromFavorites(favorite)
                removeFavoriteButton.remove()
                weaponImgContainer.remove()
                event.stopPropagation()
            })
            weaponImgContainer.addEventListener('click', () => {
                getChromaData(favorite)
            })
        } else {
            const weaponImgContainer = document.createElement('div')
            weaponImgContainer.classList.add('weapon-image-container')
            myFavoritesContainer.appendChild(weaponImgContainer)
            const weaponName = document.createElement('h3')
            weaponName.classList.add('weapon-name')
            weaponName.appendChild(document.createTextNode(`${favorite.displayName}`))
            weaponImgContainer.appendChild(weaponName)
            const imgContainer = document.createElement('div')
            imgContainer.classList.add('image-container-height')
            weaponImgContainer.appendChild(imgContainer)
            const weaponImg = document.createElement('img')
            weaponImg.classList.add('weapon-image-height')
            weaponImg.src = `${favorite.chromas[0].fullRender}`
            imgContainer.appendChild(weaponImg)
            const favoriteButtonContainer = document.createElement('div')
            favoriteButtonContainer.classList.add('favorite-button-container')
            weaponImgContainer.appendChild(favoriteButtonContainer)
            const favoriteButton = document.createElement('i')
            favoriteButton.classList.add('fa-regular', 'fa-heart', 'fa-xl')
            const removeFavoriteButton = document.createElement('i')
            removeFavoriteButton.classList.add('fa-solid', 'fa-heart', 'fa-2xl')
            favoriteButtonContainer.appendChild(removeFavoriteButton)
            removeFavoriteButton.addEventListener('click', (event) => {
                removeFromFavorites(favorite)
                removeFavoriteButton.remove()
                weaponImgContainer.remove()
                event.stopPropagation()
            })
            weaponImgContainer.addEventListener('click', () => {
                getSkinData(favorite)
            })
        }
    }
}

myFavoritesButton.addEventListener('click', goToFavorites)

const createBackButton = (parentContainer, weaponOrSkin, currentPage, previousPage) => {
    const backContainer = document.createElement('div')
    backContainer.classList.add('back-container')
    parentContainer.appendChild(backContainer)
    const backText = document.createElement('h3')
    if (currentPage === specificWeaponContainer) {
        backText.appendChild(document.createTextNode('Back to weapons'))
    } else if (weaponOrSkin) {
    backText.appendChild(document.createTextNode(`Back to ${weaponOrSkin.displayName}`))
    } else {
        backText.appendChild(document.createTextNode('Back to Favorites'))
    }
    backContainer.appendChild(backText)
    backContainer.addEventListener('click', () => {
        currentPage.classList.add('hidden')
        previousPage.classList.remove('hidden')
        currentPage.replaceChildren()
    })
}



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
        const weaponImgContainer = document.createElement('div');
        weaponImgContainer.classList.add('weapon-image-container');
        weaponsContainer.appendChild(weaponImgContainer);
        const weaponName = document.createElement('h3')
        weaponName.classList.add('weapon-name')
        weaponName.appendChild(document.createTextNode(`${weapon.displayName}`))
        weaponImgContainer.appendChild(weaponName)
        const imgContainer = document.createElement('div')
        imgContainer.classList.add('image-container-height')
        weaponImgContainer.appendChild(imgContainer)
        const weaponImg = document.createElement('img');
        weaponImg.classList.add('weapon-image-height');
        weaponImg.src = `${weapon.displayIcon}`;
        imgContainer.appendChild(weaponImg);
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
    weaponName.appendChild(document.createTextNode(`${weapon.displayName}`));
    weaponNameContainer.appendChild(weaponName);
    const skinsContainer = document.createElement('div');
    skinsContainer.classList.add('skin-container');
    specificWeaponContainer.appendChild(skinsContainer);
    for (const skin of weapon.skins) {
        if (skin.contentTierUuid && skin.chromas[0].fullRender) {
        const skinImgContainer = document.createElement('div')
        skinImgContainer.classList.add('weapon-image-container')
        skinsContainer.appendChild(skinImgContainer)
        const weaponName = document.createElement('h3')
        weaponName.classList.add('weapon-name')
        weaponName.appendChild(document.createTextNode(`${skin.displayName}`))
        skinImgContainer.appendChild(weaponName)
        const imgContainer = document.createElement('div')
        imgContainer.classList.add('image-container-height')
        skinImgContainer.appendChild(imgContainer)
        const skinImg = document.createElement('img')
        skinImg.classList.add('weapon-image-height')
        skinImg.src = `${skin.chromas[0].fullRender}`
        imgContainer.appendChild(skinImg)
        skinImgContainer.addEventListener('click', () => {
            getSkinData(skin, weapon)
        })
        }
    }
    createBackButton(specificWeaponContainer, weapon, specificWeaponContainer, weaponContainer)
}

const getSkinData = (skin, weapon, favorite) => {
    myFavorites.classList.add('hidden')
    specificWeaponContainer.classList.add('hidden')
    specificSkinContainer.classList.remove('hidden')
    const weaponNameContainer = document.createElement('div');
    weaponNameContainer.classList.add('weapon-name-container');
    specificSkinContainer.appendChild(weaponNameContainer);
    const skinHeader = document.createElement('h2')
    skinHeader.appendChild(document.createTextNode(`${skin.displayName}`))
    weaponNameContainer.appendChild(skinHeader);
    if (skin.levels[(skin.levels.length - 1)].streamedVideo) {
        const skinContainer = document.createElement('div')
        skinContainer.classList.add('skin-container-column')
        specificSkinContainer.appendChild(skinContainer)
        const skinImgContainer = document.createElement('div')
        skinImgContainer.classList.add('skin-full-image-container-no-click')
        skinContainer.appendChild(skinImgContainer)
        const skinImg = document.createElement('img')
        skinImg.classList.add('chroma-image')
        skinImg.src = `${skin.chromas[0].fullRender}`
        skinImgContainer.appendChild(skinImg)
        const skinVideoContainer = document.createElement('div')
        skinVideoContainer.classList.add('video-container')
        skinContainer.appendChild(skinVideoContainer)
        const skinVideo = document.createElement('video')
        skinVideo.classList.add('chroma-video')
        skinVideo.setAttribute('controls', true)
        skinVideo.volume = 0.25;
        skinVideoContainer.appendChild(skinVideo)
        const skinVideoSource = document.createElement('source')
        const favoriteButtonContainer = document.createElement('div')
        favoriteButtonContainer.classList.add('favorite-button-container')
        skinImgContainer.appendChild(favoriteButtonContainer)
        const favoriteButton = document.createElement('i')
        favoriteButton.classList.add('fa-regular', 'fa-heart', 'fa-2xl')
        const removeFavoriteButton = document.createElement('i')
        removeFavoriteButton.classList.add('fa-solid', 'fa-heart', 'fa-2xl')
        if (favorites.indexOf(skin) === -1 && !localStorage.getItem(`${skin.displayName}`)) {
            favoriteButtonContainer.appendChild(favoriteButton)
        } else {
            favoriteButtonContainer.appendChild(removeFavoriteButton)
        }
        favoriteButton.addEventListener('click', () => {
            addToFavorites(skin)
            favoriteButton.remove()
            favoriteButtonContainer.appendChild(removeFavoriteButton)
        })
        removeFavoriteButton.addEventListener('click', () => {
            removeFromFavorites(skin)
            removeFavoriteButton.remove()
            favoriteButtonContainer.appendChild(favoriteButton)
        })
        skinVideoSource.src = `${skin.levels[(skin.levels.length - 1)].streamedVideo}`
        skinVideo.appendChild(skinVideoSource)
        const chromaNameContainer = document.createElement('div')
        chromaNameContainer.classList.add('weapon-name-container')
        skinContainer.appendChild(chromaNameContainer)
        const chromaContainer = document.createElement('div')
        chromaContainer.classList.add('chroma-container')
        skinContainer.appendChild(chromaContainer)
        const chromaName = document.createElement('h3')
        chromaName.appendChild(document.createTextNode(`${skin.displayName} Chromas`));
        chromaNameContainer.appendChild(chromaName)
        if (skin.chromas.length > 1) {
        for (let i = 1; i < skin.chromas.length; i++) {
            let chroma = skin.chromas[i]
            const skinImgContainer = document.createElement('div')
            skinImgContainer.classList.add('skin-full-image-container')
            chromaContainer.appendChild(skinImgContainer)
            const weaponName = document.createElement('h3')
            weaponName.classList.add('weapon-name')
            weaponName.appendChild(document.createTextNode(`${chroma.displayName}`))
            skinImgContainer.appendChild(weaponName)
            const imgContainer = document.createElement('div')
            imgContainer.classList.add('image-container-height')
            skinImgContainer.appendChild(imgContainer)
            const skinImg = document.createElement('img')
            skinImg.classList.add('weapon-image-height')
            skinImg.src = `${chroma.fullRender}`
            imgContainer.appendChild(skinImg)
            skinImgContainer.addEventListener('click', () => {
                getChromaData(chroma, skin)
            })
            skinImgContainer.addEventListener('click', () => {
                pauseVideo(skinVideo)
            })
        }
            } else {
                const nullVideoImgContainer = document.createElement('div')
                nullVideoImgContainer.classList.add('null-image-container')
                chromaContainer.appendChild(nullVideoImgContainer)
                const nullVideoImg = document.createElement('img')
                nullVideoImg.classList.add('null-image')
                nullVideoImg.src = 'https://i.redd.it/h044s6irkmr81.png'
                nullVideoImgContainer.appendChild(nullVideoImg)
                const nullVideo = document.createElement('h3')
                nullVideo.classList.add('text-center')
                nullVideo.innerHTML = 'Sorry, chromas for this skin do not exist.'
                nullVideoImgContainer.appendChild(nullVideo)
            }
    } else {
        const skinContainer = document.createElement('div')
        skinContainer.classList.add('skin-container-column')
        specificSkinContainer.appendChild(skinContainer)
        const skinImgContainer = document.createElement('div')
        skinImgContainer.classList.add('skin-full-image-container-no-click')
        skinContainer.appendChild(skinImgContainer)
        const skinImg = document.createElement('img')
        skinImg.classList.add('chroma-image')
        skinImg.src = `${skin.chromas[0].fullRender}`
        skinImgContainer.appendChild(skinImg)
        const favoriteButtonContainer = document.createElement('div')
        favoriteButtonContainer.classList.add('favorite-button-container')
        skinImgContainer.appendChild(favoriteButtonContainer)
        const favoriteButton = document.createElement('i')
        favoriteButton.classList.add('fa-regular', 'fa-heart', 'fa-xl')
        const removeFavoriteButton = document.createElement('i')
        removeFavoriteButton.classList.add('fa-solid', 'fa-heart', 'fa-2xl')
        if (favorites.indexOf(skin) === -1) {
            favoriteButtonContainer.appendChild(favoriteButton)
        } else {
            favoriteButtonContainer.appendChild(removeFavoriteButton)
        }
        favoriteButton.addEventListener('click', () => {
            addToFavorites(skin)
            favoriteButton.remove()
            favoriteButtonContainer.appendChild(removeFavoriteButton)
        })
        removeFavoriteButton.addEventListener('click', () => {
            removeFromFavorites(skin)
            removeFavoriteButton.remove()
            favoriteButtonContainer.appendChild(favoriteButton)
        })
        const nullVideoImgContainer = document.createElement('div')
        nullVideoImgContainer.classList.add('null-image-container')
        skinContainer.appendChild(nullVideoImgContainer)
        const nullVideoImg = document.createElement('img')
        nullVideoImg.classList.add('null-image')
        nullVideoImg.src = 'https://i.redd.it/h044s6irkmr81.png'
        nullVideoImgContainer.appendChild(nullVideoImg)
        const nullVideo = document.createElement('h3')
        nullVideo.classList.add('text-center')
        nullVideo.innerHTML = 'Sorry, video for this skin does not exist in the API.'
        nullVideoImgContainer.appendChild(nullVideo)
        if (skin.chromas.length > 1) {
            const chromaNameContainer = document.createElement('div')
            chromaNameContainer.classList.add('weapon-name-container')
            skinContainer.appendChild(chromaNameContainer)
            const chromaContainer = document.createElement('div')
            chromaContainer.classList.add('chroma-container')
            skinContainer.appendChild(chromaContainer)
            const chromaName = document.createElement('h3')
            chromaName.appendChild(document.createTextNode(`${skin.displayName} Chromas`));
            chromaNameContainer.appendChild(chromaName)
            for (let i = 1; i < skin.chromas.length; i++) {
                let chroma = skin.chromas[i]
                const skinImgContainer = document.createElement('div')
                skinImgContainer.classList.add('skin-full-image-container')
                chromaContainer.appendChild(skinImgContainer)
                const weaponName = document.createElement('h3')
                weaponName.classList.add('weapon-name')
                weaponName.appendChild(document.createTextNode(`${chroma.displayName}`))
                skinImgContainer.appendChild(weaponName)
                const imgContainer = document.createElement('div')
                imgContainer.classList.add('image-container-height')
                skinImgContainer.appendChild(imgContainer)
                const skinImg = document.createElement('img')
                skinImg.classList.add('weapon-image-height')
                skinImg.src = `${chroma.fullRender}`
                imgContainer.appendChild(skinImg)
                skinImgContainer.addEventListener('click', () => {
                    getChromaData(chroma, skin)
                })
            }
                } else {
                    const chromaNameContainer = document.createElement('div')
                    chromaNameContainer.classList.add('weapon-name-container')
                    skinContainer.appendChild(chromaNameContainer)
                    const chromaContainer = document.createElement('div')
                    chromaContainer.classList.add('chroma-container')
                    skinContainer.appendChild(chromaContainer)
                    const chromaName = document.createElement('h3')
                    chromaName.appendChild(document.createTextNode(`${skin.displayName} Chromas`));
                    chromaNameContainer.appendChild(chromaName)
                    const nullVideoImgContainer = document.createElement('div')
                    nullVideoImgContainer.classList.add('null-image-container')
                    chromaContainer.appendChild(nullVideoImgContainer)
                    const nullVideoImg = document.createElement('img')
                    nullVideoImg.classList.add('null-image')
                    nullVideoImg.src = 'https://i.redd.it/h044s6irkmr81.png'
                    nullVideoImgContainer.appendChild(nullVideoImg)
                    const nullVideo = document.createElement('h3')
                    nullVideo.classList.add('text-center')
                    nullVideo.innerHTML = 'Sorry, chromas for this skin do not exist.'
                    nullVideoImgContainer.appendChild(nullVideo)
                }
    }
    if (weapon) {
    createBackButton(specificSkinContainer, weapon, specificSkinContainer, specificWeaponContainer)
    } else {
        createBackButton(specificSkinContainer, favorite, specificSkinContainer, myFavorites)
    }
}

const pauseVideo = (skinVideo) => {
    skinVideo.pause()
}

const getChromaData = (chroma, skin, favorite) => {
    myFavorites.classList.add('hidden')
    specificSkinContainer.classList.add('hidden')
    specificChromaContainer.classList.remove('hidden')
    const chromaNameContainer = document.createElement('div')
    chromaNameContainer.classList.add('weapon-name-container')
    specificChromaContainer.appendChild(chromaNameContainer)
    const chromaHeader = document.createElement('h2')
    chromaHeader.appendChild(document.createTextNode(`${chroma.displayName}`))
    chromaNameContainer.appendChild(chromaHeader)
    const skinContainer = document.createElement('div')
    skinContainer.classList.add('skin-container-column')
    specificChromaContainer.appendChild(skinContainer)
    const skinImgContainer = document.createElement('div')
        skinImgContainer.classList.add('skin-full-image-container-no-click')
        skinContainer.appendChild(skinImgContainer)
        const skinImg = document.createElement('img')
        skinImg.classList.add('chroma-image')
        skinImg.src = `${chroma.fullRender}`
        skinImgContainer.appendChild(skinImg)
        const favoriteButtonContainer = document.createElement('div')
        favoriteButtonContainer.classList.add('favorite-button-container')
        skinImgContainer.appendChild(favoriteButtonContainer)
        const favoriteButton = document.createElement('i')
        favoriteButton.classList.add('fa-regular', 'fa-heart', 'fa-xl')
        const removeFavoriteButton = document.createElement('i')
        removeFavoriteButton.classList.add('fa-solid', 'fa-heart', 'fa-2xl')
        if (favorites.indexOf(chroma) === -1 && !localStorage.getItem(`${chroma.displayName}`)) {
            favoriteButtonContainer.appendChild(favoriteButton)
        } else {
            favoriteButtonContainer.appendChild(removeFavoriteButton)
        }
        favoriteButton.addEventListener('click', () => {
            addToFavorites(chroma)
            favoriteButton.remove()
            favoriteButtonContainer.appendChild(removeFavoriteButton)
        })
        removeFavoriteButton.addEventListener('click', () => {
            removeFromFavorites(chroma)
            removeFavoriteButton.remove()
            favoriteButtonContainer.appendChild(favoriteButton)
        })
    if (chroma.streamedVideo) {
    const chromaVideoContainer = document.createElement('div')
    chromaVideoContainer.classList.add('video-container')
    skinContainer.appendChild(chromaVideoContainer)    
    const chromaVideo = document.createElement('video')
    chromaVideo.classList.add('chroma-video')
    chromaVideo.setAttribute('controls', true)
    chromaVideo.volume = 0.25;
    chromaVideoContainer.appendChild(chromaVideo)
    const chromaVideoSource = document.createElement('source')
    chromaVideoSource.src = `${chroma.streamedVideo}`
    chromaVideo.appendChild(chromaVideoSource)
    } else {
        const nullVideoImgContainer = document.createElement('div')
        nullVideoImgContainer.classList.add('null-image-container')
        skinContainer.appendChild(nullVideoImgContainer)
        const nullVideoImg = document.createElement('img')
        nullVideoImg.classList.add('null-image')
        nullVideoImg.src = 'https://i.redd.it/h044s6irkmr81.png'
        nullVideoImgContainer.appendChild(nullVideoImg)
        const nullVideo = document.createElement('h3')
        nullVideo.classList.add('text-center')
        nullVideo.innerHTML = 'Sorry, video for this skin does not exist in the API.'
        nullVideoImgContainer.appendChild(nullVideo)
    }
    if (skin) {
    createBackButton(specificChromaContainer, skin, specificChromaContainer, specificSkinContainer)
    } else {
    createBackButton(specificChromaContainer, favorite, specificChromaContainer, myFavorites)
    }
}

const addToFavorites = (skin) => {
    localStorage.setItem(`${skin.displayName}`, JSON.stringify(skin))
    favorites.push(skin)
}

const removeFromFavorites = (skin) => {
    localStorage.removeItem(`${skin.displayName}`)
    favorites.forEach((favorite) => {
        if (favorite.displayName === skin.displayName) {
            favorites.splice(favorites.indexOf(favorite), 1)
        }
    })
}

