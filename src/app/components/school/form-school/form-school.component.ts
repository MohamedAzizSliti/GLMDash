import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Select2Data, Select2UpdateEvent } from 'ng-select2-component';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Attachment } from '../../..//shared/interface/attachment.interface';

import { CountryState } from '../../../shared/state/country.state';
import { StateState } from '../../../shared/state/state.state';
import { CustomValidators } from '../../../shared/validator/password-match';
import * as data from '../../../shared/data/country-code';
import {CompanyState} from '../../../shared/state/company.state';
import {CreateCompany, EditCompany, UpdateCompany} from '../../../shared/action/company.action';
import {Companies} from '../../../shared/interface/company.interface';

@Component({
  selector: 'app-form-school',
  templateUrl: './form-school.component.html',
  styleUrls: ['./form-school.component.scss']
})
export class FormSchoolComponent {

  @Input() type: string;

  @Select(CountryState.countries) countries$: Observable<Select2Data>;
  @Select(CompanyState.selectedCompany) store$: Observable<Companies>;

  public states$: Observable<Select2Data>;

  private destroy$ = new Subject<void>();

  public form: FormGroup;
  public id: number;
  public codes = data.countryCodes;

  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      school_name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      country_id: new FormControl('788', [Validators.required]),
      state_id: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),

      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      country_code: new FormControl('216', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
      company_logo_id: new FormControl(''),

      status: new FormControl(1),

    }
  ,{
    validator : CustomValidators.MatchValidator('password', 'password_confirmation')
  })
}

  get passwordMatchError() {
    return (
      this.form.getError('mismatch') &&
      this.form.get('password_confirmation')?.touched
    );
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            this.states$ = this.store
                .select(StateState.states)
                .pipe(map(filterFn => filterFn(null)));
            return this.store
                      .dispatch(new EditCompany(params['id']))
                      .pipe(mergeMap(() => this.store.select(CompanyState.selectedCompany)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(company => {
        this.id = company?.id!;
        this.form.patchValue({
          school_name: company?.school_name,
          description: company?.description,
          country_id: company?.country_id,
          state_id: company?.state_id,
          city: company?.city,
          address: company?.address,
          pincode: company?.pincode,
          name: company?.client?.name,
          email: company?.client?.email,
          country_code: company?.client?.country_code,
          phone: company?.client?.phone,
          company_logo_id: company?.company_logo_id,
          hide_client_email: company?.hide_client_email,
          hide_client_phone: company?.hide_client_phone,
          status: company?.status,
          facebook: company?.facebook,
          instagram: company?.instagram,
          pinterest: company?.pinterest,
          youtube: company?.youtube,
          twitter: company?.twitter,
        });
      });
  }

  countryChange(data: Select2UpdateEvent) {
    if(data && data?.value) {
      this.states$ = this.store
          .select(StateState.states)
          .pipe(map(filterFn => filterFn(+data?.value)));
      this.form.controls['state_id'].setValue('');
    } else {
      this.form.controls['state_id'].setValue('');
    }
  }

  selectStoreLogo(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['company_logo_id'].setValue(data ? data.id : '');
    }
  }

  submit() {
    this.form.markAllAsTouched();

    let action = new CreateCompany(this.form.value);
    if(this.type == 'edit' && this.id) {
      this.form.removeControl('password');
      this.form.removeControl('password_confirmation');
      action = new UpdateCompany(this.form.value, this.id)
    }

    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => {
          this.form.reset();
          this.router.navigateByUrl('/school');
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
