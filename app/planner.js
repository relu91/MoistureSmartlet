module.exports = function planner(device,forecasts,maxDuty,minDuty){
    let update = plan(new Date(), device.duty, forecasts)
    
    if (update) {
        device.updateDuty(minDuty)
    }else{
        device.updateDuty(maxDuty)
    }
}


function plan(currentTime,dutyCycle,forecasts) {
    let outForecasts = []
    outForecasts = outForecasts.concat(forecasts)

    const dutyInMilli = 2 * dutyCycle * 60 * 1000; // convert minutes to milliseconds multiplied by 2

    const nextWakeUp = new Date(currentTime.getTime() + dutyInMilli);

    let waterForecast = outForecasts[0];
    // remove heading forecasts
    while (waterForecast && waterForecast.to < currentTime) waterForecast = outForecasts.pop();

    let update = false;
    for (let index = 0; index < outForecasts.length && outForecasts[index].from <= nextWakeUp && !update ; index++) {
        const element = outForecasts[index];
        
        if (element.mm > 0) {
            update = true;
        }
    }

    return update
}