# School Bus System

#### Requirements

1. Login/Regirster Page

    - **Register**:
        - Email, phone, password, school, parents of who
        - Only for parents, can't register as school's admin account
        - Select one school
        - After register, will send a notification to admin to verify the parents account
        - Or admin could add parents' email in their white list in advance
    - **Login**:
        - Username + password
        - Parents should select their location on map and be autmatically assigned to the closest stop and route. Have to do it first.

2. Home Page

    - For Parents:
        - Route & Bus's detail: - Bus's info (Plate), Route Name
        - start stop - end stop name and start time and est end time
        - next stop, est and distance
        - user's stop, est and distance
        - view map (show route and current location in map)
        - Change address and stop
        - request to change address and bus stop
    - For Admin:
        - Chose Your School
        - Each route's detail as the parents, but show a list of all routes (Collapsible Lists)

3. Nav Bar

    - home page
    - parent's account management(only for admin)
    - buses' management(only for admin)
    - Task(only for admin)

4. Account Management

    - notification (new parent's account, change address request)
    - parents info table
        - name
        - email
        - phone
        - kid's name
        - address
        - bus stop
        - verify status(if hasn't confirm, show link to tasks tab, otherwise text)
        - edit
    - edit card
        - could edit all info about parents

5. Bus Management

    - Routes list (Card List)
    - Each route has different stops and time schedule
    - Each route can be edited, popup card or change to editable card, can change each stop's address, add more stops or delete any stop.
    - Assign buses to routes
    - Buses list, can edit bus's plate, add more busses

6. Tasks
    - task list(card list)
    - new account creat request (confirm / deny + reasons)
    - change address request (confirm / deny + reasons)
