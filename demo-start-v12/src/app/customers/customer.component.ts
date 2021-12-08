import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerForm!: FormGroup;
  customer: Customer = new Customer();

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
      email: [
        '',
        [Validators.required, Validators.email]
      ],
      phone: '',
      notification: 'email',
      sendCatalog: true
    })
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
}
