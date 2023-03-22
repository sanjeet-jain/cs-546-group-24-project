# Group project for cs 546 Stevens Institute of Technology

## Better Calendar 1.0

### Code owners :

```
Jonathan Kim
Mahesh
Sanjeet Vinod Jain
Sunderamurthy
```

### Feature set :

- Calendar can be customised according to us
- make TODO list of items using a drag drop feature into specific dates
- journal entries for specific dates ( can be personal and shareable?)
- notes for specific dates and lectures on that date? ( make it shareable?)
- can set goals and targets ( with a from and uptill date )
- gives reminder/alert of tasks and targets ( like a progress checker )
- based on select keywords it gives different notifications also sets them into a category as well
- different visualizations for on time/ late/ done
- allow collaborations with other users if permitt optional?
- integration with amazon, walmart, etc for estimated delivery dates ? and notify about the same
- Integration of canvas calendar to our web app

types of events :
events ( generic term ), TODO items / Tasks , reminders, and notes, meeting

types =["task","reminder","note","meeting"]

Task Collection Fields : {
title : string
type : string
DateCreated : Date time stamp

dateAddedTo:
monthAddedTo:
yearAddedTo:
timeAddedTo:

dateDueOn:
monthDueOn:
yearDueOn:
timeDueOn:

priority :

textBody: string

tag: string treat as a custom type for filter

checked/ done/ completed flag ? : boolean
}

Reminder Collection Fields : {
title : string
type : string
DateCreated : Date time stamp

dateAddedTo:
monthAddedTo:
yearAddedTo:
timeAddedTo:

dateDueOn:
monthDueOn:
yearDueOn:
timeDueOn:

priority :

textBody: string

tag: string treat as a custom type for filter

repeating : boolean
repeatingCounter? increment? : increments in days, weekly , monthly, yearly

}

Notes Collection Fields : {
title : string
type : string
DateCreated : Date time stamp

dateAddedTo:
monthAddedTo:
yearAddedTo:
timeAddedTo:

textBody: string

tag: string treat as a custom type for filter

documentLink : (used by notes)

}

Meeting Collection Fields : {
title : string
type : string
DateCreated : Date time stamp

dateAddedTo:
monthAddedTo:
yearAddedTo:
timeAddedTo:

date :
month :
year:
timeStart :
duration :

priority :

textBody: string

tag: string treat as a custom type for filter

repeating : boolean
repeatingCounter? increment? : increments in days, weekly , monthly, yearly
}

Display Attributes for each object type {
color =
badge =
type/tag =
}

User Collection {
first name
last name
email id
date of birth
consent to data collection
disabilities :boolean  
}
