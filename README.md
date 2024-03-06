# CH_2023_Final_POC_Team1
# BookMySeat

#OverView
BookMySeat is a web application designed to facilitate seat booking for employees even before they arrive at the office. It addresses the need for efficient seat management, user registration approval by admins, and streamlined booking processes.
#Role

1. Admin
* Receives email notifications for user registrations and can approve or reject them.
* Accesses an Admin Dashboard for managing user details and seat bookings.
* Generates reports on user preferences and filters them by date.
* Manages user approvals, user creation/modification, location, project, floor restrictions, seat restrictions, employee shift mapping, booking cutoff timing, and bulk user upload.



2. User
* Accesses a dashboard to view future bookings, edit/cancel them, and create new bookings.
* When creating a new booking, selects booking range, floor, seat, lunch option, tea/coffee preference, and parking option (if applicable).
* Manages user profile, including profile information, booking history, and password change.
* Receives seat preferences based on teammates' seating.

#Screens
1. Login/Register
2. User Dashboard
3. Admin Dashboard
4. Reception Dashboard

#Technical Notes
* Registration Flow: Email triggers for admin approval upon user registration. Admin approves/rejects, and corresponding emails are sent to the user. Validations include password complexity and Valtech email verification.
* Login: Role-based navigation after login.
* Screen Designs: Developed during story refinement.
* DB Designs: Finalized before development.
* Tech Stack:
* Backend: Spring Boot
* Frontend: React
* Database: MySQL

#Installation and Setup
1. Clone the repository.
2. Set up backend (Spring Boot) and frontend (React) environments.
3. Configure MySQL/SQL database.
4. Run backend and frontend servers.
5. Access the application through the provided URLs.


