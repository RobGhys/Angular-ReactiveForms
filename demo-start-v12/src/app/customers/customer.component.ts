import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn} from '@angular/forms';

import { Customer } from './customer';

/**
 *Specific validator used only in this component
 * @param control: an AbstractControl (either form-control or form-group)
 * @returns a map of {string, boolean} if the form is valid
 * @returns null if the form is invalid
 */
function ratingRange(min: number, max: number): ValidatorFn {

  return (control: AbstractControl): { [key: string]: boolean } | null => {
    // Return true if control.value is invalid
    if (control.value !== null && (isNaN(control.value) || min || max)) {
      return {'range': true};
    }
    // Return null if validation is ok
    else {
      return null;
    }
  }
}

function emailMatcher(control: AbstractControl): { [key: string]: boolean } | null {
  // Use of non-null assertion operator '!'
  const emailControl = control.get('email')!;
  const confirmControl = control.get('confirmEmail')!;

  // Return null if either form has not been touched yey ('pristine')
  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }

  // Return null if both values match
  if (emailControl.value === confirmControl.value) {
    return null;
  }
  // Return a map of { 'match' : true} if control values differ
  else {
    return { 'match': true };
  }
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerForm!: FormGroup;
  customer: Customer = new Customer();
  emailMessage = '';

  private validationMessages: any = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // Initializes the customerForm with the formBuilder
    this.customerForm = this.formBuilder.group({
      firstName: [
        '',
        [Validators.required, Validators.minLength(3)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.maxLength(50)]
      ],
      emailGroup: this.formBuilder.group({
        email: [
          '',
          [Validators.required, Validators.email]
        ],
        confirmEmail: [
          '',
          Validators.required
        ],
      }, { validator: emailMatcher }),
      phone: '',
      notification: 'email',
      rating: [
        null,
        ratingRange
        ],
      sendCatalog: true
    });

    // Use a Watcher to check for changes in the form inputs-9-*
    this.customerForm.get('notification')!.valueChanges.subscribe(
      value => this.setNotification(value)
    );

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl!.valueChanges.subscribe(
      value => this.setMessage(emailControl)
    );
  }

  populateTestData(): void {
    // patchValue allows to set values for some of the form's fields
    // even if there are missing values
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Dorsey',
      email: 'jack@twitter.com',
      sendCatalog: false
    })
  }

  setNotification(notificationMethod: string): void {
    const phoneControl = this.customerForm.get('phone');

    // Null proof
    if (phoneControl === null) {
      return;
    }

    if (notificationMethod === 'text') {
      phoneControl.setValidators(Validators.required);
    }
    else {
      phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity();
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }


  setMessage(control: AbstractControl | null): void {
    // Clear current emailMessage
    this.emailMessage = '';

    // Determine a validation message should be displayed
    if ((control!.untouched || control!.dirty) && control!.errors) {
      this.emailMessage = Object.keys(control!.errors).map(
        key => this.validationMessages[key]).join('');
    }
  }
}
