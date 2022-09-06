const InputJSON = require('./input.json')
const {cashInCommissionFee, commissionTypes, userTypes, cashOutGovtFee, cashOutRegularFee} = require('./Contants')
const moment = require('moment')
const { dateBetweenTwoDate } = require('./uti')

function CalWeeklyLimit(date : any , user_id : string){

    const weekPreViousDates = dateBetweenTwoDate(moment(date).startOf('isoWeek'), moment(date))

    let thisWeekTotalTrans : number = 0;

    for (let index = 0; index < InputJSON.length; index++) {
        
        if(weekPreViousDates.indexOf(InputJSON[index].date) > -1 && InputJSON[index].user_id == user_id && InputJSON[index].type == commissionTypes.cash_out){
            thisWeekTotalTrans += parseFloat(InputJSON[index].operation.amount)
        }
        
    }

    return thisWeekTotalTrans

}

function CalCashIn(data : any){

    const commission = data.operation.amount * cashInCommissionFee.percents/100

    return commission > cashInCommissionFee.max.amount ? cashInCommissionFee.max.amount : commission

}

function CalRegCashOut(data : any){
    
    const thisWeekTrans = CalWeeklyLimit(data.date, data.user_id)

    if(thisWeekTrans <= cashOutRegularFee.weekly_limit.amount){

        return 0

    }else{


        const transWithOutCurrentDate = thisWeekTrans - data.operation.amount
        
        if(transWithOutCurrentDate >= cashOutRegularFee.weekly_limit.amount){

            return cashOutRegularFee.percents * data.operation.amount / 100

        }else{

            return (thisWeekTrans - cashOutRegularFee.weekly_limit.amount) * cashOutRegularFee.percents / 100
            
        }
    }

}

function CalGovCashOut(data : any){

    const commission : number = data.operation.amount * cashOutGovtFee.percents/100

    return commission < cashOutGovtFee.min.amount ? cashOutGovtFee.min.amount : commission

}

function CalculateTrans(data : any){

    let result : any = []

    for (let index = 0; index < data.length; index++) {

        const element = data[index];

        if(element.type == commissionTypes.cash_in){

            result.push(CalCashIn(element).toFixed(2)) 

        }else if(element.type == commissionTypes.cash_out && element.user_type == userTypes.regular){

            result.push(CalRegCashOut(element).toFixed(2)) 

        }else if(element.type == commissionTypes.cash_out && element.user_type == userTypes.govt){

            result.push(CalGovCashOut(element).toFixed(2)) 

        }
        
    }

    return result

}

const result = CalculateTrans(InputJSON)

console.log(result)

