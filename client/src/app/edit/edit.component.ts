import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EntityService } from '../services/entity.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private entityService: EntityService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setupForm();
  }

  onSubmit() {
    this.entityService.update(
      parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10),
      this.form.value
    ).subscribe(result => {
      // TODO notify user
    });
  }

  private setupForm() {
    const entity = this.activatedRoute.snapshot.data['entity'];

    this.form = this.formBuilder.group({
      name: [entity.name],
      notes: [entity.notes],
      property_type: [entity.property_type],
      room_type: [entity.room_type],
      house_rules: [entity.house_rules]
    });
  }

}
