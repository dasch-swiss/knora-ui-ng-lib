import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DisplayEditComponent } from '../../operations/display-edit/display-edit.component';
import { PropertyInfoValues } from '../resource-view/resource-view.component';
import { ReadResource, PropertyDefinition, ReadValue } from '@knora/api';
import { AddValueComponent } from '../../operations/add-value/add-value.component';

@Component({
  selector: 'kui-property-view',
  templateUrl: './property-view.component.html',
  styleUrls: ['./property-view.component.scss']
})
export class PropertyViewComponent implements OnInit {

  @ViewChild('displayEdit', { static: false }) displayEditComponent: DisplayEditComponent;
  @ViewChild('addValue', { static: false}) addValueComponent: AddValueComponent;
  
  /**
   * Parent resource
   *
   * @param (resource)
   */
  @Input() parentResource: ReadResource;

  /**
   * Array of property object with ontology class prop def, list of properties and corresponding values
   *
   * @param (propArray)
   */
  @Input() propArray: PropertyInfoValues;

  /**
   * Array of system property object with list of system properties
   *
   * @param (propArray)
   */
  @Input() systemPropArray?: PropertyDefinition;

  createAllowed: boolean; // used to toggle add value button
  createMode: boolean; // used to toggle add value form field
  newValue: ReadValue;

  constructor() { }

  ngOnInit() {
    this.createAllowed = true;
    console.log('propArray: ', this.propArray);
    console.log('systemPropArray: ', this.systemPropArray);
  }

  showAddValueForm(prop: PropertyInfoValues) {
    this.newValue = new ReadValue();

    // TODO: get user permission level
    this.newValue.userHasPermission = 'CR';

    console.log('prop: ', prop);
    this.newValue.type = prop.propDef.objectType;
    this.newValue.id = prop.propDef.id;
    
    this.createMode = true;
    this.createAllowed = false;
  }

  hideAddValueForm(emitterMessage?: string) {
    this.createMode = false;
    this.createAllowed = true;
  }

}
