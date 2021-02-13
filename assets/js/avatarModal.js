import { Avataaars } from "./avataaars.js";
import { avatar } from "./avatarClass.js";
import { avatarModalListeners } from "./avatarModalListeners.js";
import { customColor, optionsWithBlank, menuText } from "./avatarOptions.js";

export function createAvatarModal(properties) {
  const myAvatar = new avatar(properties);

  const $modal = `
    <div id="avatarModalBackground" class="avatarModal__background">
        <div id="avatarModal" class="avatarModal">
            <button id="avatarModalClose" class="avatarModal__close material-icons">cancel</button>
            <div id="avatarModalImage" class="avatarModal__image"></div>
            <select name="avatarOptions" id="avatarOptions"> </select>
            <button id="avatarRandom__button"><i class="fas fa-random"></i></button>
            <div id="avatarModalResults" class="avatarModal__results"></div>
            <span class="avatarModal__colorTag">Colour</span>
            <div id="avatarModalColors" class="avatarModal__colors"></div>
            <span class="avatarModal__hairColorTag">Hair colour</span>
            <div id="avatarModalHairColors" class="avatarModal__hairColors"></div>
        </div>
    </div>`;

  document.getElementById("employee").innerHTML += $modal;

  printSelectOptions();
  printMainAvatar(myAvatar);
  printResults(Object.keys(Avataaars.paths)[0], myAvatar);
  printColors(myAvatar, Object.keys(Avataaars.paths)[0]);

  avatarModalListeners(myAvatar);
}

function printSelectOptions() {
  const $select = document.getElementById("avatarOptions");
  Object.keys(Avataaars.paths).forEach((option) => {
    if(option == 'nose') {
      return;
    }
    $select.innerHTML += `<option value="${option}">${menuText[option]}</option>`;
  });
}

export function printResults(optionName, myAvatar) {
  const avatarResults = document.getElementById("avatarModalResults");
  let resultsHtml = "";

  if(optionName == 'skin') {
    resultsHtml += Object.keys(Avataaars.colors[optionName])
    .map(type => getAvatarMiniature(myAvatar, optionName, type))
    .join('')  
  } else if (optionsWithBlank[optionName]) {
    resultsHtml += getAvatarMiniature(myAvatar, optionName, undefined);
  }
  resultsHtml += Object.keys(Avataaars.paths[optionName])
        .map(type => getAvatarMiniature(myAvatar, optionName, type))
        .join('')


  avatarResults.innerHTML = resultsHtml;

  function getAvatarMiniature(myAvatar, optionName, type) {
    if(optionName == 'eyebrow') {
      console.log(type)
    }
    const options = {
      width:100
    };
    options[optionName] = (type ? type : undefined);
    return `<button id="${
      optionName + "-" + (type ? type : 'none')
    }" class="avatarModal__results__button ${type === myAvatar.getProperty(optionName) ? 'selected' : ''}" 
      data-property="${optionName}" data-value="${type}"> ${myAvatar.getAvatar(options)} </button>`;
  }
}

export function printColors(myAvatar, optionName, current) {
  const colorResults = document.getElementById("avatarModalColors");
  const hairColorsResults = document.getElementById("avatarModalHairColors");
  const colorTag = document.querySelector('.avatarModal__colorTag');
  const hairColorTag = document.querySelector('.avatarModal__hairColorTag');

  if (customColor[optionName] != undefined && optionName != "facialHair" && optionName != "skin") {
    const propertyName = customColor[optionName].name;
    let colorPallete = "palette";
    colorResults.style.maxWidth = "80px";
    colorTag.style.opacity = 1;
    colorResults.innerHTML = ''
                
    if (Avataaars.colors[propertyName] != undefined) {
      colorPallete = propertyName;
    }

    printColorsInNode(colorPallete, colorResults, propertyName);
  } else {
    colorResults.style.maxWidth = "";
    colorTag.style.opacity = 0;  
  }

  if (optionName == "top" || optionName == "facialHair") {
    if (optionName == "top") {
      optionName = "hair";
    }
    const propertyName = customColor[optionName].name;
    hairColorsResults.innerHTML = ``;
    hairColorsResults.style.maxWidth = "80px";
    hairColorTag.style.opacity = 1;
    printColorsInNode("hair", hairColorsResults, propertyName);
  } else {
    hairColorsResults.style.maxWidth = "";
    hairColorTag.style.opacity = 0;
  }

  function printColorsInNode(colorPallete, node, propertyName) {
    const currentValue = myAvatar.getProperty(propertyName);
    const colors = Object.keys(Avataaars.colors[colorPallete]);

    for (const colorName of colors) {
      const color = Avataaars.colors[colorPallete][colorName];

      const $button = `<button id="${colorName}" class="avatarModal__colors__button ${currentValue==colorName ? 'selected': ''}" style="background-color:${color};" data-property="${propertyName}" data-value="${colorName}"></button>`;

      node.innerHTML += $button;
    }
  }
}

export function printMainAvatar(myAvatar) {
  const mainAvatar = myAvatar.getAvatar({
    width: 300
  });
  document.getElementById("avatarModalImage").innerHTML = mainAvatar
}