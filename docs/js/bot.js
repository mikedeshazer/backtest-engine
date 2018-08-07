


var bot= function(){

    $('#results').hide();
    this.data = theRespData;

    this.amountInWallet = 25000;

    this.amountInMarket = 0;
    removeAnnotations();
         

    this.algo = function(){
       
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

    this.run = function(){


    }
    this.hold= function(whichElem, weight, metric){
        console.log("holding");
        var currentPrice = this.data[whichElem][4];
        this.checkIsFinal(whichElem, currentPrice);
    }
    this.buy = function(whichElem, weight, metric){
        //close price 

        if(typeof metric =="undefined"){
            metric=weight;
        }
        var currentPrice = this.data[whichElem][4];

        var amountPerWeight = this.amountInWallet * (weight/100);
          console.log('buy @ ' + this.data[whichElem][4] + " with "+ amountPerWeight)
        this.amountInWallet = this.amountInWallet - amountPerWeight;
        this.amountInMarket = this.amountInMarket + (amountPerWeight/currentPrice);
        chart1.addAnnotation( {
              labels: [{
                id:'buy-'+whichElem,
                backgroundColor:"green",
                point: {
                  x: this.data[whichElem][0],
                  y: currentPrice,
                  yAxis: 0,
                  xAxis: 0
                },
                text: parseInt(metric).toString(),
              }]
    })  
        this.checkIsFinal(whichElem, currentPrice);
    }

    this.sell = function(whichElem, weight, metric){
        //close price
        
        var currentPrice = this.data[whichElem][4];
          if(typeof metric =="undefined"){
            metric=weight;
        }
       
        var amountPerWeight = this.amountInMarket * (weight/100);
          console.log('sell @ ' + currentPrice + ". Amount to seel= "+ amountPerWeight)
        // console.log(weight)
        this.amountInWallet = this.amountInWallet + (amountPerWeight * currentPrice);
        this.amountInMarket = this.amountInMarket -  amountPerWeight;

         chart1.addAnnotation( {
              labels: [{
                id:'sell-'+whichElem,
                backgroundColor:"red",
                point: {
                  x: this.data[whichElem][0],
                  y: currentPrice,
                  yAxis: 0,
                  xAxis: 0
                },
                text: parseInt(metric).toString(),
              }]
        })  

         this.checkIsFinal(whichElem, currentPrice);

    }


    this.checkIsFinal = function(whichElem, currentPrice){
        $('#results').show();
        if(whichElem >= (this.data.length-1)){
            console.log("index is... "+whichElem+" this is final");
            console.log("You have "+ this.amountInWallet+ " in cash");
            console.log("You have "+ this.amountInMarket+ " in digital assets @ "+ currentPrice);
            $('#amountInWallet').html(this.amountInWallet.toFixed(2));
            $('#amountInMarket').html(this.amountInMarket.toFixed(2));
             $('#currentPrice').html(currentPrice.toFixed(2));
             $('#accountValue').html((this.amountInWallet + (this.amountInMarket *currentPrice)).toFixed(2));

            console.log("selling remainder...");
            console.log("your total value is "+ (this.amountInWallet + (this.amountInMarket *currentPrice)));
        }
    }


    
    this.isOdd = function(num) { return num % 2;}
}
