# API

## end points

### questions
url end point path, default

            /api/questions/

### Review
#### get
        
retrieve active template with a list of question so that the user can request collegues for review, retrieve from the template

          /api/questions/

get all reviews active and inactive 

        /api/questions/all

get question review from active template for specific user, user has to be authenticated, it will check whether the {userId} is the same as the current log in user, this is to allow only the person giving review to resume...

        /api/questions/userId

#### post

create the list of people who will review you, this will generate request id

 /api/questions/


get all reviews for active question template 

        /api/questions/feeds/

get review by project manager or hr for a specific user using the user id and reportid, the system will veryfy your role either as PM or HR else return un authorised

/api/report/id


### question

