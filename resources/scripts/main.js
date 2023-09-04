const enterButton = document.getElementById('enter-button');
const mobileFooter = document.getElementById('mobile-footer');
const weaponContainer = document.getElementById('weapon-container');


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
        weaponImgContainer.classList.add('weapon-image-container');
        weaponContainer.appendChild(weaponImgContainer);
        let weaponImg = document.createElement('img');
        weaponImg.classList.add('weapon-image');
        weaponImg.src = `${weapon.displayIcon}`;
        weaponImgContainer.appendChild(weaponImg);        
    }

}