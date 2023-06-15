export interface Studio {
    _id: string
    name: string
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

export interface Class {
    _id: string
    name: string
    instructor: Instructor
    studio: Studio
    style: string | STYLE
    day: DAY
    dateTime: Date
    alreadyHappened: boolean    // default should be false
    signedUp?: boolean
    adminModified?: boolean
    sub?: string    // if present, that is the sub
}

export const Brickhouse: Studio = {
    _id: '1', name: 'Brickhouse', address: '156 W 44th Street 3rd Floor, New York, NY 10036'
}
export const SamJavi: Instructor = {
    _id: '2', name: 'Sam Javi'
}
export const JaviClass: Class = {
    _id: '3', 
    name: 'Int/Adv Choreography', 
    instructor: SamJavi, 
    studio: Brickhouse,
    style: "Choreography", 
    day: "Friday", 
    dateTime: new Date('Friday, June 16, 2023 18:30:00'), 
    alreadyHappened: false
}