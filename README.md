# Backtest-Engine
Simple backtest engine in javascript with built-in visualizer 

-----

This simple js library (js/bot.js), allows you to test backtest trade strategies and backtest.


There is a demo of how this works (bot.html). This demo pulls live data from Poloniex and Bitfinex to test your strategies against, allowing you to toggle against different time frames.

To build a bot:

``` javascript

  mybot = new bot();

  mybot.algo = pickedAlgo; //your referred algo (some are stored in js/algo.js)

  mybot.algo(); //run the algo and visualize it


 javascript ```


Here is an example of on how to build a bot algo:

Notes: this.data is the data in the series that you loaded and is cycled through in a for loop to run your script

this.buy(index, weight, metric) allows you to buy a particular index in the loop (0 is the first data set with a timestamps' time, open, high, low, close and volume... in that order) and the weight is between 0 and 100 of how much of your funds left to buy with, or sell if you're using sell), while metric is the indicator you would like to publish to the chart showing what indicator it was using to make a decision.

Example:

``` javascript
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


            index= index+1;
        }

}



 javascript```


Have fun!

