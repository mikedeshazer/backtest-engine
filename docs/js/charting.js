    function showLoading(){

                $('#theLoader').fadeIn();
            }

             function hideLoading(){

                $('#theLoader').fadeOut();
            }


    $(document).ready(function(){

         initCandleChart();
    })

   function initCandleChart(){

        whichExchange = $('#exchange').val();
        whichCurrency = $('#currencypair').val();
        whichPeriod = $('#period').val();
        
        renderCandleChart(whichExchange, whichCurrency, whichPeriod);

        listenForChartUpdate();
        
    }








  












     function renderCandleChart(exchange, currencypair, period){
                // Set candle chart id globally




                            $('.traditionalCats').hide();
                   $('.cryptoCats').show();

                   $('#tradeTotal').hide()
            $('#tradeTotal1').hide()


                            $('#indicators_box').show();
                            //props.seriesCandleId = currencypair;

                           

                            $.getJSON('https://stark-island-54204.herokuapp.com/cloud/api/beta/'+exchange+'.php?currencypair='+currencypair+"&period="+period, function (data) {
            console.log(data)
            hideLoading();
            setTimeout(function(){

              $('.highcharts-range-selector-group').hide()
            },100)
            if(typeof data.status =="string"){
                alert(data.msg);
                return;
            }

            $('#chartdiv').show();
                // split the data set into ohlc and volume
                var ohlc = [],
                    volume = [],
                    // set the allowed units for data grouping
                    groupingUnits = [[
                        'week',                         // unit name
                        [1]                             // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]];

                    theRespData = data;
                data.forEach(function(item) {
                    var itemDate = item[0],
                        itemOpen = item[1],
                        itemHigh = item[2],
                        itemLow = item[3],
                        itemClose = item[4],
                        itemVolume = item[5];

                    var isRising = (itemClose > itemOpen),
                        itemColor = isRising ? '#00D66F' : '#F83922';

                    ohlc.push({
                        x: itemDate,
                        open: itemOpen,
                        high: itemHigh,
                        low: itemLow,
                        close: itemClose,
                        color: itemColor
                    });

                    volume.push({
                        x: itemDate,
                        y: itemVolume,
                        color: itemColor
                    });
                });


                // create the chart



                Highcharts.theme = {
               colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                  '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
               chart: {
                  backgroundColor: "#2f3e47",
                  style: {
                     fontFamily: '\'Unica One\', sans-serif'
                  },
                  plotBorderColor: '#606063'
               },
               title: {
                  style: {
                     color: '#E0E0E3',
                     textTransform: 'uppercase',
                     fontSize: '20px'
                  }
               },
               subtitle: {
                  style: {
                     color: '#E0E0E3',
                     textTransform: 'uppercase'
                  }
               },
               xAxis: {
                  gridLineColor: '#707073',
                  labels: {
                     style: {
                        color: '#E0E0E3'
                     }
                  },
                  lineColor: '#707073',
                  minorGridLineColor: '#505053',
                  tickColor: '#707073',
                  title: {
                     style: {
                        color: '#A0A0A3'

                     }
                  }
               },
               yAxis: {
                  gridLineColor: '#707073',
                  labels: {
                     style: {
                        color: '#E0E0E3'
                     }
                  },
                  lineColor: '#707073',
                  minorGridLineColor: '#505053',
                  tickColor: '#707073',
                  tickWidth: 1,
                  title: {
                     style: {
                        color: '#A0A0A3'
                     }
                  }
               },
               tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  style: {
                     color: '#F0F0F0'
                  }
               },
               plotOptions: {
                  series: {
                     dataLabels: {
                        color: '#B0B0B3'
                     },
                     marker: {
                        lineColor: '#333'
                     }
                  },
                  boxplot: {
                     fillColor: '#505053'
                  },
                  candlestick: {
                     lineColor: '#F83922',
                     color: "#F83922",
                     upColor: '#00D66F',
                     upLineColor: "#00D66F"
                  },
                  errorbar: {
                     color: 'white'
                  }
               },
               legend: {
                  itemStyle: {
                     color: '#E0E0E3'
                  },
                  itemHoverStyle: {
                     color: '#FFF'
                  },
                  itemHiddenStyle: {
                     color: '#606063'
                  }
               },
               credits: {
                  style: {
                     color: '#666'
                  }
               },
               labels: {
                  style: {
                     color: '#707073'
                  }
               },

               drilldown: {
                  activeAxisLabelStyle: {
                     color: '#F0F0F3'
                  },
                  activeDataLabelStyle: {
                     color: '#F0F0F3'
                  }
               },

               navigation: {
                  buttonOptions: {
                     symbolStroke: '#DDDDDD',
                     theme: {
                        fill: '#505053'
                     }
                  }
               },

               // scroll charts
               rangeSelector: {
                  buttonTheme: {
                     fill: '#505053',
                     stroke: '#000000',
                     style: {
                        color: '#CCC'
                     },
                     states: {
                        hover: {
                           fill: '#707073',
                           stroke: '#000000',
                           style: {
                              color: 'white'
                           }
                        },
                        select: {
                           fill: '#000003',
                           stroke: '#000000',
                           style: {
                              color: 'white'
                           }
                        }
                     }
                  },
                  inputBoxBorderColor: '#505053',
                  inputStyle: {
                     backgroundColor: '#333',
                     color: 'silver'
                  },
                  labelStyle: {
                     color: 'silver'
                  }
               },

               navigator: {
                  handles: {
                     backgroundColor: '#666',
                     borderColor: '#AAA'
                  },
                  outlineColor: '#CCC',
                  maskFill: 'rgba(255,255,255,0.1)',
                  series: {
                     color: '#7798BF',
                     lineColor: '#A6C7ED'
                  },
                  xAxis: {
                     gridLineColor: '#505053'
                  }
               },

               scrollbar: {
                  barBackgroundColor: '#808083',
                  barBorderColor: '#808083',
                  buttonArrowColor: '#CCC',
                  buttonBackgroundColor: '#606063',
                  buttonBorderColor: '#606063',
                  rifleColor: '#FFF',
                  trackBackgroundColor: '#404043',
                  trackBorderColor: '#404043'
               },

               // special colors for some of the
               legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
               background2: 'red',
               dataLabelsColor: '#B0B0B3',
               textColor: '#C0C0C0',
               contrastTextColor: '#F0F0F3',
               maskColor: 'rgba(255,255,255,0.3)'
            };

            // Apply the theme
            Highcharts.setOptions(Highcharts.theme);






chart1 = Highcharts.stockChart('container', {

        panning:true,

        rangeSelector: {
            selected: 1
        },

        title: {
            text: currencypair + ' Historical'
        },

        yAxis: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '60%',
            lineWidth: 2,
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
        }],

        tooltip: {
            split: true,
            enabledIndicators: true
        },

        series: [{
            
            type: 'candlestick',
            name: currencypair,
            data: ohlc,
            dataGrouping: {
                units: groupingUnits,
                enabled: false
            }
        }, {
           
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            // upColor:"red"
            dataGrouping: {
                units: groupingUnits,
                enabled: false
            }
        }],

        indicators: [
         //   getIndicator(props.indicators.options[0].key)
        ],

        chart: {
            events: {
                //redraw: onChartRedraw
            }
        }
    } );












                
            });




        }









function listenForChartUpdate(){

    $('#hello select').on("change", function(){


      $('#containerCoor').hide();

      //if not crypto, do not call this command
      if($('#currencypair').val().indexOf('maybeNotCrypto') !=-1 || $('#exchange').val().indexOf('maybeNotCrypto') !=-1 ){

          if($('#currencypair').val().indexOf('maybeNotCrypto') !=-1 && $('#exchange').val().indexOf('maybeNotCrypto') !=-1){

            renderNonExchangeAveragePriceMaybeStock($('#currencypair').val().split('-maybe')[0]);
                return;

          }
          else if( isCryptoAndExchangeMatch() ==true){
            //pass through 
            
          }
          else{
            lity('#alertMsg')
            return;
          }

    
      }
        showLoading()
        updateCandleChart();
       // updateOrderBook(whichExchange, whichCurrency);
       // getTicker();
       // getNews($('#currencypair').val());

    })
}



 function updateCandleChart(){

                whichExchange = $('#exchange').val();
                whichCurrency = $('#currencypair').val();
                whichPeriod = $('#period').val();
                renderCandleChart(whichExchange, whichCurrency, whichPeriod);

            }




function removeAnnotations(){
  
      annotations = chart1.annotations
  for ( i = annotations.length - 1; i > -1; --i) {
    chart1.removeAnnotation(annotations[i].options.id)
  }
    
}