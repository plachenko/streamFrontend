let prevData;

let thresh = {
    min: {
        r: 10,
        g: 10,
        b: 10
    },
    max: {
        r: 200,
        g: 200,
        b: 200
    }
};

function threshold(){
    // return a threshold limit for either max or min values.
}

export const processImg = (data, stepNum = 1) => {
      // 2) Check and set previous image data.
    if(!prevData){
        prevData = data;
    }

    // 3) Run through image data pixels...
    for(let c = 0; c < data.length; c += 4){
        if( (data[c+0] <= thresh.min.r && 
            data[c+1] <= thresh.min.b && 
            data[c+2] <= thresh.min.g) ||
            (data[c+0] >= thresh.max.r && 
            data[c+1] >= thresh.max.b && 
            data[c+2] >= thresh.max.g) ) {

            data[c + 3] = 0;
        }
        /*
        if(data[c + 0] >= prevData[c + 0] && data[c+1] >= prevData[c+1] + 2){
            data[c + 0] -= prevData[c + 1]/.3 + 20;
            data[c + 1] -= prevData[c + 2] / 1.9 + 10;
            data[c + 2] += prevData[c + 2] / 4;


            if(prevData[c+0] >= 135){
                data[c+0] += Math.sin(stepNum*.4 / prevData[c + 0] * 200) * 100;
                data[c+1] += Math.cos(stepNum*.4 / prevData[c + 1] * 200) * 100;
                data[c+2] = prevData[c+0]/5;
                data[c+3] += 10;
            }
            // console.log(c);
        }else{
            data[c + 0] = 40;
            data[c + 3] = 0;
        }
        */
    }

    return data;
}