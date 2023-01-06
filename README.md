This is an app that I have made by following blog/tutorial from snyk.io

The main aim of this app is to learn rate limiting, logging and other security related concepts

Also, one of the aims of this project is to dockerize the process and hence, learn docker as well

Now, go ahead and run the code again to try this out for yourself by using the node index.js command.

So how does this work? Here’s a simple usage flow:

    Navigating to / will work.
    Navigating to /protected will return a 401 (Unauthorized) HTTP status code.
    Navigating to /login will automatically log you in, displaying “Successfully authenticated.”
    Navigating to /login again will display “Already authenticated.” 
    When you access /protected, the page will now work.
    Navigating to /logout resets the session and displays “Successfully logged out.”
    Then, /protected again becomes inaccessible, displaying a 401 status code.
    Revisiting /logout will also return a 401 status code.

By using the protect middleware before the request handler, we can guard an endpoint by ensuring a user has logged in. Additionally, we have the /login and /logout endpoints to reinforce these capabilities.
