Krzysztof Szczerbowski - FormBuilder project

The form builder allows the user to generate a form with nested questions (questions which appear only if a condition regarding the previous question is met). Ways in which you can create these follow-up questions corresond strictly with type of 'parent' questions.

There is a little validation which doesn't allow you to create the form if you've left any field empty - you'll get a Notiflix warning notification about this.

If you don't want to show the form builder part and show only the generated form, feel free to press ctrl+Shift+H, this will leave only the generated form visible. If you wish to make everything visible again, just press ctrl+shift+H again. This setting is saved in localStorage so if you refresh the page, the form will 'remember' which parts should be visible and which not.

What is also saved in localStorage is an object representing the form you created, no need to worry that you'll lose the questions you've created. However, if you want to start anew, there's a big red button on the bottom :)
