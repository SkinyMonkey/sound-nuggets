### Use git flow!

To create your branches

https://danielkummer.github.io/git-flow-cheatsheet/

Use the standard branches and prefix when initializing your fork with git flow init:

master
develop

feature/
hotfix/
release/
support/

To:
- add a feature
- fix a bug
-> use git flow feature start and finish

### Commit Subjects

Please use one of the following prefixes in your commit subject:

fix - 
add -
remove -
mod - 

And keep in mind this simple rule for your commit message :

If applied, what is this commit doing to the code

### Linting

Before pushing, do a safety commit and please use linting with

```yarn run lint```

You can try to use this commande to automatically fix some of the issues:

```yarn run lintfix```

And the scripts in scripts for some more auto clean up

If the linting is going wrong please contact me so I can help you or do some cleanup on my side.

### Development

Install the last meteor release

Use yarn to install the packages
Use the meteor command and you should be ready to go!

### Testing

Is coming, it's still on the older repo
