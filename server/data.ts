export type STUDO_NAME = "Peridance Center" | "Broadway Dance Center" | "Brickhouse" | "Movers Bodega"

export interface Studio {
    _id: string
    name: STUDO_NAME
    address: string
    style?: string
}

export interface Instructor {
    _id: string
    name: string
    studios?: Studio[]
}

export type STYLE = "Jazz" | "Street jazz" | "Hip hop" | "Contemporary" | "Ballet" | "Popping" | "Breaking" | "Litefeet" | "House" | "Choreography" | "Grooves" | "Other"
export type DAY = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"

// perhaps change time to startTime, include an endTime property, and/or include a length property
export interface Class {
    _id: string
    name: string
    instructor: Instructor
    studio: Studio
    style: STYLE | string
    day: DAY
    time: number
    signUpLink?: string
}

export interface SpecificClass {
    _id: string
    class: Class
    popUp: boolean      // false means it's a recurring class, true means it's a pop up
    dateTime: Date
    alreadyHappened: boolean    // default should be false
    signedUp?: boolean
    adminModified?: boolean
    sub?: string    // if present, that is the sub
    signUpLink?: string
}

export interface Administrator {
    _id: string
    name: string
    email: string
}

let instructors: Instructor[] = [
    {_id: '2', name: 'Sam Javi'},
    {_id: '4', name: 'Huu Rock'},
    { _id: '5', name: 'Kenichi Kasamatsu'},
    {_id: '13', name: 'Sheila Barker'},
    {_id: '15', name: 'Brandon Trent'},
    {_id: '17', name: 'Julian DeGuzman'}
]

export const studios: Studio[] = [
    {_id: '1', name: 'Brickhouse', address: '156 W 44th Street 3rd Floor, New York, NY 10036'},
    {_id: '6', name: 'Broadway Dance Center', address: 'Manhattan'},
    {_id: '7', name: 'Peridance Center', address: 'SoHo'},
    {_id: '8', name: 'Movers Bodega', address: 'Queens'}
]

export const classes: Class[] = [
    {
        _id: '3', 
        name: 'Int/Adv Choreography', 
        instructor: instructors[0], 
        studio: studios[0],
        style: "Choreography", 
        day: "Friday", 
        time: 1830
    },
    {
        _id: '9',
        name: 'Beginner House',
        instructor: instructors[1],
        studio: studios[1],
        style: "House",
        day: "Tuesday",
        time: 1130
    },
    {
        _id: '10',
        name: 'Int/Adv House',
        instructor: instructors[1],
        studio: studios[3],
        style: 'House',
        day: 'Tuesday',
        time: 2000
    },
    {
        _id: '11',
        name: 'Int/Adv Street Jazz',
        instructor: instructors[2],
        studio: studios[1],
        style: 'Street jazz',
        day: 'Monday',
        time: 1745
    },
    {
        _id: '12',
        name: 'Adv Choreography',
        instructor: instructors[2],
        studio: studios[2],
        style: 'Choreography',
        day: 'Tuesday',
        time: 1900
    },
    {
        _id: '14',
        name: 'Adv Beg Jazz',
        instructor: instructors[3],
        studio: studios[1],
        style: 'Jazz',
        day: 'Wednesday',
        time: 1330
    },
    {
        _id: '16',
        name: 'Adv Choreography',
        instructor: instructors[4],
        studio: studios[0],
        style: 'Choreography',
        day: 'Friday',
        time: 2000
    },
    {
        _id: '18',
        name: 'Pop Up',
        instructor: instructors[5],
        studio: studios[0],
        style: 'Choreography',
        day: 'Wednesday',
        time: 1800
    }
]