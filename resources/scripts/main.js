const enterButton = document.getElementById('enter-button');
const mobileFooter = document.getElementById('mobile-footer');
const weaponContainer = document.getElementById('weapon-container');
const specificWeaponContainer = document.getElementById('specific-weapon-container')


const enterSite = () => {
    enterButton.classList.add('hidden');
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

    for (const weapon of weaponData) {
        let weaponImgContainer = document.createElement('div');
        weaponImgContainer.classList.add('weapon-image-container', `${weapon.displayName}`);
        weaponContainer.appendChild(weaponImgContainer);
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
    const weaponName = document.createElement('h1');
    weaponName.classList.add('weapon-name');
    weaponName.innerHTML = `${weapon.displayName}`;
    weaponNameContainer.appendChild(weaponName);
    const skinsContainer = document.createElement('div');
    skinsContainer.classList.add('skin-container');
    specificWeaponContainer.appendChild(skinsContainer);
    console.log(weapon.skins)
    for (const skin of weapon.skins) {
        if (skin.contentTierUuid && skin.displayIcon) {
        const skinImgContainer = document.createElement('div')
        skinImgContainer.classList.add('weapon-image-container')
        skinsContainer.appendChild(skinImgContainer)
        const skinImg = document.createElement('img')
        skinImg.classList.add('weapon-image')
        skinImg.src = `${skin.displayIcon}`
        skinImgContainer.appendChild(skinImg)
        }
    }
}