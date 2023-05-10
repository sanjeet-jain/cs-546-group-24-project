# Group project for cs 546 Stevens Institute of Technology

## TimeWise Calendar

### Code owners :

```
Jonathan Kim
Mahesh
Sanjeet Vinod Jain
Sunderamurthy
```

# Introduction

Introducing TimeWise, the all-in-one calendar application that helps users manage their time efficiently.
TimeWise offers a variety of features, including the ability to add events, TODO items, reminders, and notes
based on the user's requirements. Users can even add notes with downloadable images and PDFs to keep track
of important information.
TimeWise also provides badges for on-time, late, and incomplete events, allowing users to stay on top of their
schedules. With a one-time notification that summarizes all the items for the current day and any alerts, users
can start their day on the right foot. TimeWise is a one-page application that comes with a user profile page to
manage personal details, change passwords, and clear the calendar and account with confirmation. Users can
easily add, delete, or edit events, reminders or TODO items with the ease of dragging and dropping them. With
filtering options, tagging, and different view modes, TimeWise offers a seamless experience for managing and
planning effectively.

# Core Features

1. The application is a calendar that allows users to add events, TODO items, reminders, and notes
   according to their requirements.
2. Users can add notes with downloadable images and PDFs.
3. Events can be one-time or recurring with timestamps and goals (start and end dates).
4. The application provides different badges for on-time, late, and incomplete events.
5. A one-time notification is given when the page is opened for the day regarding all the items for the
   current day and any alerts (summary page).
6. The application is a one-page application with a user profile page to change the password or personal
   details, clear the calendar and account with confirmation.
7. Users can add events by clicking the add event button or can drag and drop events from the list of
   events on the right side.
8. Users can also delete or edit the events as well.
9. The right side includes the top next 50 items for the calendar month in order of priority set by the user
   and shows filtering options for the calendar.
10. Users can filter the calendar based on the type of events or schedules and add different tags for
    filtering.
11. The left pane shows current items for the day and has a smaller calendar for quick navigation.
12. The middle pane is the calendar with different view modes i.e daily, weekly, and monthly modes with
    basic navigation.
13. TODO items appear with checkboxes on the calendar and on the right pane.
    Optional Features we included from our initial proposal
14. This will also have a progress bar showing on the left side below the event for events with a begin and
    end
15. Theme functionality for the calendar

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Installation

To clone and install the project, follow these steps:

1. Clone the repository to your local machine:

```
git clone https://github.com/sanjeet-jain/cs-546-group-24-project
```

2. Navigate to the project directory root:

```
cd <wherever the project is cloned into>
```

3. Install the dependencies:

```
npm install
```

## Usage

To seed the project, use the following command:

```
npm run seed
```

To run the project, use the following command:

```
npm run start
```

if you want to run it in developer mode to restart the app on file changes then

```
npm run dev
```

This will start the Express server and make the application available at `http://localhost:3000/`.

## Technologies Used

- [Express](https://expressjs.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Handlebars](https://handlebarsjs.com/)
- [Node.js](https://nodejs.org/)

## Application Live Demo

[application demo](https://timewise.herokuapp.com/)
[application demo walkthrough ](https://www.youtube.com/watch?v=PUucsGUEUDY&ab_channel=SanjeetJain)

## Contributing

If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your fork.
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
