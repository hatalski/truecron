import Locale from 'ember-intl/models/locale';

export default Locale.extend({
  locale: 'en',
  messages: {
    auth: {
      googleButton: 'Continue with Google',
      signInButtonNav: 'SIGN IN',
      signUpButtonNav: 'SIGN UP',
      or: 'OR',
      signin_form: {
        header: 'Sign In:',
        button: 'SIGN IN',
        accountNotExists: 'Need an account?',
        forgottenPassword: 'forgotten password?',
        signupLink: 'Sign Up Now',
        placeholders: {
          email: 'Email',
          password: 'Password'
        }
      },
      signup_form: {
        header: 'Create your TrueCron Account:',
        warning: 'By clicking "Sign up for TrueCron", you agree to our terms of service and privacy policy.',
        button: 'SIGN UP FOR TRUECRON',
        accountExists: 'Already have an account?',
        signinLink: 'Sign In',
        titles: {
          password: 'Password must contain at least 8 characters, including UPPER/lowercase and numbers.'
        },
        placeholders: {
          email: 'Email',
          password: 'Password (more than 8 characters in length)',
          confirm: 'Enter password again'
        }
      },
      recovery_form: {
        header: 'Password Recovery:',
        button: 'SEND EMAIL WITH INSTRUCTIONS',
        titles: {
          password: 'Password must contain at least 8 characters, including UPPER/lowercase and numbers.'
        },
        placeholders: {
          email: 'Email'
        }
      },
      reset_form: {
        header: 'Change your Password:',
        button: 'CHANGE PASSWORD',
        placeholders: {
          password: 'New password',
          confirm: 'Retype new password'
        }
      }
    },
    landing: {
      pitch: 'Enterprise Strength Scheduling for your Growing Business',
      moto1: 'Do your job.',
      moto2: 'We will do the scheduling.',
      footer: '© {current-year} TrueCron. All rights reserved. TrueCron is an registered trademarks of Naviam, Inc. Terms, conditions, features, availability, pricing, fees, service and support options subject to change without notice.',
      beta_invite: {
        header: 'Interested?',
        description: 'Leave your e-mail address to get notified when we are live.',
        email_placeholder: 'Email',
        button: 'SIGN UP',
        confirmation: {
          header: 'THANK YOU',
          share: 'Share this page to spread the world',
          button_close: 'Close'
        }
      },
      what: {
        header: 'What is TRUECRON?',
        description1: 'TrueCron is the scheduler you have been waiting for.',
        description2: 'It is the way the scheduler should have been built, but was not.',
        list: {
          item1: 'It runs on our servers so you do not have to worry about infrastructure.',
          item2: 'It knows that developers actually test code before releasing it into production.',
          item3: 'It knows that the fiscal calendar does not end in December.',
          item4: 'It does not make you write a Powershell script to copy a file.'
        }
      },
      features: {
        header: 'Simply put, TrueCron is a scheduler that allows you to create a complex tasks in several clicks, peer review it, test and release to production and be sure it will run properly.',
        feature1: {
          header: 'BUILD TEST RELEASE CYCLE SUPPORT',
          description: 'Finally a scheduler made for Software Developers by Software Developers. We think that scheduled jobs are as important as your production code. Therefore it should be tested as such. Production code is typically created in a development environment, tested there and then integrated into staging environment, tested there again and only then released to production. This is exactly what TrueCron supports for scheduled jobs. Connect to your Github and make sure your jobs are proper.'
        },
        feature2: {
          header: 'EXTENSIVE LIBRARY OF OUT OF THE BOX TASKS',
          description: 'We want to create your jobs fast. So we provided pre-configured tasks for you. We can do it all from running arbitrary executable on a remote machine to encrypting a file and uploading it to S3 storage. We got tasks like SQL query execution, FTP operations, file management, MS Office format manipulations, SMTP operations, etc.'
        },
        feature3: {
          header: 'POWERFUL & FLEXIBLE SCHEDULER',
          description: 'No matter how complex your schedule is, we will support it. We support custom calendars like state, religious and company holidays; fiscal calendars and arbitrary calendar exceptions. Our proprietary easy to use scheduling UI allows you to set up a complicated schedule in a matter of seconds. Comprehensive scheduling dashboard provides a bird eye view of all your jobs.'
        },
        feature4: {
          header: 'SECURE AND RELIABLE',
          description: 'Extensively pen tested by independent experts and state of the art SSAE-16 certified application will assure security of your data.'
        },
        feature5: {
          header: 'GROWS WITH YOU',
          description: 'We are made to scale. Whether you have 10 or 10 000 jobs TrueCron will grow with you and make sure that scheduling is not the thing you should worry about.'
        }
      }
    }
  }
});
