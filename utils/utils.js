
    //use this to convert the 255 values to "255" eg "015"
export const byteToString = (byteIn) => {
    let roundo = (byteIn + 0.0) / 100
    let converty = (Math.round(roundo * 100) / 100).toFixed(2);
    let outputty = String(converty.replace(".",""))
        //in case there are trailing 0s outside of the size 
    let finalOut = outputty
    //if (outputty.length > 3) {
    //    finalOut = outputty.substring(0,3)
    //}
    //console.log(outputty)
    return finalOut
}
export const convertColor = (colorIn) => {
    const hexo = colorIn.startsWith('#') ? colorIn.slice(1) : colorIn;
    const hexoRed = "0x" + hexo.substring(0,2)
    const hexoGreen = "0x" + hexo.substring(2,4)
    const hexoBlue = "0x" + hexo.substring(4,6)
    const colorOut = [Number(hexoRed), Number(hexoGreen), Number(hexoBlue)]
    return colorOut
}

export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  // Calculate the position of the value within the input range as a normalized value between 0 and 1
  const normalizedValue = (value - inMin) / (inMax - inMin);

  // Map the normalized value to the output range
  const mappedValue = normalizedValue * (outMax - outMin) + outMin;

  return mappedValue;
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//convert array of strings to list of key value pairs
export const stringToKeyValue = (stringoArray) => {
    let outputList = {}
    for (let i=0; i < stringoArray.length; i++) {
        let split = stringoArray[i].split(':')
        outputList[split[0].trim()] = split[1].trim();
    }   
    return outputList
}

export const hex2rgb = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    let rgb = [r,g,b]
    for (let i = 0; i < 3; i++) {
        rgb[i] = rgb[i]/100
        rgb[i] = rgb[i].toFixed(2)
        let tempV = String(rgb[i])
        tempV = tempV.replace(".", "")
        rgb[i] = tempV
    }
    return { rgb };
}