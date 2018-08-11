
function randomWalkAlgo(){

    var index = 0;
        for(i in this.data){

           // console.log(this.data[i][0])
            var weight = Math.floor(Math.random() * 100); 

            if(parseInt(weight) % 3 == 0 || parseInt(weight) % 4 == 0 ){
                this.hold(index, weight)
            }

            else if(this.isOdd(parseInt(weight))){
                this.buy(index, weight)
            }
            else{
                this.sell(index,weight)
            }

            index= index+1;
        }

}




function fisherAlgo(){

    var index = 0;

    highestHigh =0;
    lowestLow = 0;

    allPrevious = [];

    topGuide = .5;
    bottomGuide = -1.0;
    highSell = 0;
    lowBuy = 0;

  f = new fisherTransform();
  f.onStart(10);

        for(i in this.data){

          weight=100;

          fisherNums= f.onIntervalClose(10, this.data[i][2], this.data[i][3])
          
          if(index < 16){
            index= index+1;
            continue;
          }

          fish = fisherNums[0]['value']
          signal = fisherNums[1]['value']
        


        if(fish < -bottomGuide && signal <fish){
          this.buy(index, weight, fish);
        }
        else if(fish > topGuide && signal > fish){
          this.sell(index, weight, fish)
        }
        else{
          this.hold(index,weight)
        }

       




            index= index+1;
        }

}






function fisherTransform(){

var periodLow=0
var raw=0
 var output=0

average = function(elmt) {
  var sum = 0;
for( var i = 0; i < elmt.length; i++ ){
    sum += parseInt( elmt[i], 10 ); //don't forget to add the base
}

var avg = sum/elmt.length;

return avg;
}


var smoothingExponent,
    fisherExponent,
    label,
    signalLabel,
    midpoints = [],
    raws = [],
    smoothed,
    logarithm,
    logarithms = [],
    fisher,
    lastFisher;

// TODO Could parameterize smoothing periods
var smoothingPeriods = 5;
var fisherPeriods = 3;

function validate (periods) {
    if (typeof periods !== "number") {
        error("Fisher Transform periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Fisher Transform periods must be an integer");
    }
    if (periods > 100) {
        error("Fisher Transform maximum periods is 100");
    }
    if (periods <= 0) {
        error("Fisher Transform periods must be greater than 0");
    }
}

function getRunUpCount (periods) {
    return periods + smoothingPeriods + fisherPeriods + 1;
}

function getBufferSize () {
    return 0;
}

this.onStart =function(periods) {
    smoothingExponent = 2 / (smoothingPeriods + 1);
    fisherExponent = 2 / (fisherPeriods + 1);
    label = "Fisher Transform (" + periods + ")";
    signalLabel = label + " Signal";
}

this.onIntervalClose = function (periods, HIGH, LOW) {

   
    
    midpoint = (HIGH + LOW) / 2
   

    midpoints.push(midpoint);

    if (midpoints.length < periods) {
        return null;
    } else if (midpoints.length > periods) {
        midpoints.shift();
    }

    periodLow = Math.min.apply(null, midpoints);

    raw = 2 * ((midpoint - periodLow) / (Math.max.apply(null, midpoints) - periodLow)) - 1;
    if(isNaN(raw)){
        raw =0;
    }
    if (smoothed === undefined) {
        raws.push(raw);
        if (raws.length === smoothingPeriods) {
            smoothed = average(raws);
        } else {
            return null;
        }
    } else {
        smoothed = ((raw - smoothed) * smoothingExponent) + smoothed;
    }

    logarithm = Math.log((1 + smoothed) / (1 - smoothed));

    if (fisher === undefined) {
        logarithms.push(logarithm);
        if (logarithms.length === fisherPeriods) {
            fisher = average(logarithms);
        } else {
            return null;
        }
    } else {
        fisher = ((logarithm - fisher) * fisherExponent) + fisher;
    }

    if (lastFisher === undefined) {
        lastFisher = fisher;
        return null;
    }

    output = [{
        name: label,
        overlay: false,
        value: fisher,
        precision: 3
    }, {
        name: signalLabel,
        overlay: false,
        value: lastFisher,
        precision: 3
    }];

    lastFisher = fisher;

    return output;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}



}






function williamsR(highs, lows, currentClose){
    for(i in highs){
        if(i==0){
            highestHigh = highs[i]
            lowestLow = lows[i];
        }
        else{
            if(highs[i] > highestHigh){
                highestHigh = highs[i];
            }
             if(lows[i] < lowestLow){
                lowestLow = lows[i];
            }

        }


    }

    willR = ((highestHigh-currentClose) / (highestHigh- lowestLow))*-100;
    return willR;
}



function willerAlgo(){
//really good for bear market
//high frequency


    var index = 0;
    console.log('run')
     var volumes = []
     var priceChanges = [];
     var positivePriceChanges=[];
        var negativePriceChanges=[];
    var positiveVolChanges= [];
    var negativeVolChanges = [];
 var allprices = []

 priceHighs = [];
 priceLows = [];
        for(i in this.data){


           //algo here

           // we are looking at volume to change ratios

           //when ratio is abnormal, we trade

           //change in prics is positive or negative below
           isPositive = true;

           priceHigh  = this.data[index][2]
           priceLow = this.data[index][3]
           
           priceHighs.push(priceHigh);
           priceLows.push(priceLow);



            var volume = this.data[index][5];
              allprices.push(this.data[index][4])
            var priceChange = this.data[index][4] - this.data[index][1];
            priceChanges.push(priceChange);
            if(priceChange < 0){
                isPositive = false;
                negativePriceChanges.push(Math.abs(priceChange));
                negativeVolChanges.push(Math.abs(volume));
                priceChange = Math.abs(priceChange)
            }
            else{
                isPositive= true;
                positivePriceChanges.push(priceChange);
                positiveVolChanges.push(volume);
            }

            volumes.push(volume);

            
           
             //algo here
            if(index<30){
                index= index+1;

                continue;
            }


            theWill = williamsR(priceHighs, priceLows, this.data[index][4]);
            metric = theWill;

            console.log(theWill)

            if(theWill > -70){
                  this.sell(index,100, metric);
            }
            else if(theWill <-95){
                this.buy(index,100, metric);
            }
            else{
                this.hold(index,100, metric)
            }

           

           

         
           
            // get average of volumes

            //console.log(volumes);


            index= index+1;
        }

}



function macdFunc(){

    var index = 0;
    console.log('run')
     var volumes = []
     var priceChanges = [];
     var positivePriceChanges=[];
        var negativePriceChanges=[];
    var positiveVolChanges= [];
    var negativeVolChanges = [];
 var allprices = []
        for(i in this.data){


           //algo here

           // we are looking at volume to change ratios

           //when ratio is abnormal, we trade

           //change in prics is positive or negative below
           isPositive = true;

            var volume = this.data[index][5];
              allprices.push(this.data[index][4])
            var priceChange = this.data[index][4] - this.data[index][1];
            priceChanges.push(priceChange);
            if(priceChange < 0){
                isPositive = false;
                negativePriceChanges.push(Math.abs(priceChange));
                negativeVolChanges.push(Math.abs(volume));
                priceChange = Math.abs(priceChange)
            }
            else{
                isPositive= true;
                positivePriceChanges.push(priceChange);
                positiveVolChanges.push(volume);
            }

            volumes.push(volume);

            
           
             //algo here
            if(index<30){
                index= index+1;

                continue;
            }


            theMac = macd(allprices);
            thisMac = theMac['MACD'][theMac['MACD'].length-1]
            metric= thisMac;
            console.log(thisMac);

            if(thisMac > -.1){
                  this.sell(index,100, metric);
            }
            else if(thisMac <-2){
                this.buy(index,100, metric);
            }
            else{
                this.hold(index,100, metric)
            }

           

           

         
           
            // get average of volumes

            //console.log(volumes);


            index= index+1;
        }

}



function volumeDescrepAlgo(){

    var index = 0;
    console.log('run')
     var volumes = []
     var priceChanges = [];
     var positivePriceChanges=[];
        var negativePriceChanges=[];
    var positiveVolChanges= [];
    var negativeVolChanges = [];

        for(i in this.data){


           //algo here

           // we are looking at volume to change ratios

           //when ratio is abnormal, we trade

           //change in prics is positive or negative below
           isPositive = true;

            var volume = this.data[index][5];
            var priceChange = this.data[index][4] - this.data[index][1];
            priceChanges.push(priceChange);
            if(priceChange < 0){
                isPositive = false;
                negativePriceChanges.push(Math.abs(priceChange));
                negativeVolChanges.push(Math.abs(volume));
                priceChange = Math.abs(priceChange)
            }
            else{
                isPositive= true;
                positivePriceChanges.push(priceChange);
                positiveVolChanges.push(volume);
            }

            volumes.push(volume);

            
           
             //algo here
            if(index<5){
                index= index+1;

                continue;
            }


            if(isPositive){
                avgVol = getAverage(positiveVolChanges);
                avgPriceChange = getAverage(positivePriceChanges);


                if(volume > (avgVol*1.5) && priceChange > (avgPriceChange*.6)){
                    weight = Math.abs(((1 - (volume/avgVol))*100));
                     console.log("weight="+weight);
                     if(weight>100){
                        weight=100;
                     }
                    this.buy(index,100);
                }
                else{
                    this.hold(index, 50);
                }
            }

            else{

                 avgVol = getAverage(negativeVolChanges);
                 avgPriceChange = getAverage(negativePriceChanges);



                 if(volume < (avgVol*.8) && priceChange > (avgPriceChange)){

                    weight = Math.abs(volume/avgVol) *100;
                    if(weight>100){
                        weight=100;
                     }
                     console.log("weight="+weight);
                   
                    this.sell(index,100);
                }
                else{
                    this.hold(index, 50);
                }
            }


           

           

         
           
            // get average of volumes

            //console.log(volumes);


            index= index+1;
        }

}



function getAverage(elmt){

    var sum = 0;
for( var i = 0; i < elmt.length; i++ ){
    sum += parseInt( elmt[i], 10 ); //don't forget to add the base
}

var avg = sum/elmt.length;

return avg;
}


function algoTemplate(){

    var index = 0;
  
        for(i in this.data){

         
        }

}
