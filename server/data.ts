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