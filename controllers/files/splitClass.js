exports.splitClass = (item) => {

    const classes = item.map(item => {

        let newT;
        let newTime;
        const startStr = item.start_time.slice(item.start_time.length - item.start_time.length, item.start_time.length - item.start_time.length + 2);
        const endStr = item.start_time.slice(item.start_time.length - 2, item.start_time.length);
        const middleStr = item.start_time.slice(item.start_time.length - item.start_time.length + 3, item.start_time.length - item.start_time.length + 5);
        
    
        if(endStr === 'am' || endStr === 'AM'){
            newT = parseInt(startStr) + 0
            newTime = `${newT}:${middleStr}`;
            
        }
        if(endStr === 'pm' || endStr === 'PM'){
            newT = parseInt(startStr) + 12
            newTime = `${newT}:${middleStr}`;
            
        }
    
        const now = new Date().getTime();
        const daily = 24 * 60 * 60 * 1000;
        const twoDays = 2 * 24 * 60 * 60 * 1000;
        const weekly = 7 * 24 * 60 * 60 * 1000;
        let newTimeStamp;

    
            
        const newDate = `${item.start_date} ${newTime}`;
        
        let timeStamp = new Date(newDate);

        if(timeStamp.getTime() < now){

            while(timeStamp.getTime() < now){
                if(item.frequency === 'Daily'){
                    newTimeStamp = new Date(timeStamp.getTime() + daily);
                
        
                }
                if(item.frequency === 'Every 2 days'){
                    newTimeStamp = new Date(timeStamp.getTime() + twoDays);
                
        
                }
                if(item.frequency === 'Weekly'){
                    newTimeStamp = new Date(timeStamp.getTime() + weekly);
                
                }
        
                timeStamp = newTimeStamp;
            }

        }else{

            if(item.frequency === 'Daily'){
                newTimeStamp = new Date(timeStamp.getTime() + daily);
            
    
            }
            if(item.frequency === 'Every 2 days'){
                newTimeStamp = new Date(timeStamp.getTime() + twoDays);
            
    
            }
            if(item.frequency === 'Weekly'){
                newTimeStamp = new Date(timeStamp.getTime() + weekly);
            
            }

            
        }
    
        

        // console.log(new Date(newTimeStamp).getTime());
    
        return {...item, timeStamp: newTimeStamp.getTime(), start_date: newTimeStamp.toLocaleDateString()};
    
        
    });

    return classes;
}