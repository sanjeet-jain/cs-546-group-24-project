# Group project for cs 546 Stevens Institute of Technology

## TimeWise 1.0

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

<!-- **/node_modules, **/bootstrap , **/bootstrap-icons, **/jquery -->

# Route: /meeting/:meetingId

HTTP Method: GET

Functionality: Retrieves a meeting by its ID

Input: meetingId as a URL parameter

Output: Returns a JSON object containing the meeting details, or an error message if the meeting ID is invalid or not found.

HTTP Method: DELETE

Functionality: Deletes a meeting by its ID

Input: meetingId as a URL parameter

Output: Returns a JSON object containing the deleted meeting details, or an error message if the meeting ID is invalid or not found.

HTTP Method: PUT

Functionality: Updates a meeting by its ID

Input: meetingId as a URL parameter, and the updated meeting data in the request body as a JSON object.

Output: Returns a JSON object containing the updated meeting details, or an error message if the meeting ID is invalid, the request body is empty, or the update input fields are invalid.

# Route: /user/meetings/:userId

HTTP Method: GET

Functionality: Retrieves all meetings belonging to a user

Input: userId as a URL parameter

Output: Returns a JSON array containing all meetings belonging to the user, or an error message if the user ID is invalid or if there is a server error.

HTTP Method: POST

Functionality: Creates a new meeting for a user

Input: userId as a URL parameter, and the meeting data in the request body as a JSON object.

Output: Returns a JSON object containing the new meeting details, or an error message if the user ID is invalid, the request body is empty, or the input fields are invalid.
