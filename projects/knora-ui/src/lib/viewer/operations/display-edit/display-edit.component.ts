import {AfterViewInit, Component, Inject, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {
  Constants,
  KnoraApiConnection,
  PermissionUtil,
  ReadResource,
  ReadValue,
  UpdateResource,
  UpdateValue,
  WriteValueResponse,
  CardinalityUtil,
  ResourceClassDefinition,
  CreateTextValueAsString,
  CreateValue,
  DeleteValue,
  DeleteValueResponse
} from '@knora/api';
import {BaseValueComponent} from '../../values';
import {mergeMap} from 'rxjs/operators';
import {KnoraApiConnectionToken} from '../../../core';


@Component({
  selector: 'kui-display-edit',
  templateUrl: './display-edit.component.html',
  styleUrls: ['./display-edit.component.scss']
})
export class DisplayEditComponent implements OnInit {

  @ViewChild('displayVal', {static: false}) displayValueComponent: BaseValueComponent;

  @Input() displayValue: ReadValue;

  @Input() parentResource: ReadResource;

  @Input() configuration?: object;

  @Output() valueCreated = new EventEmitter<string>();

  didCreateValue = false;

  constants = Constants;

  mode: 'read' | 'update' | 'create' | 'search';

  canModify: boolean;

  editModeActive = false;

  newValue: boolean;

  constructor(@Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection) {
  }

  ngOnInit() {

    this.mode = 'read';

    // determine if user has modify permissions
    const allPermissions = PermissionUtil.allUserPermissions(this.displayValue.userHasPermission as 'RV' | 'V' | 'M' | 'D' | 'CR');

    this.canModify = allPermissions.indexOf(PermissionUtil.Permissions.M) !== -1;

    if(this.displayValue.id === '') {
      this.newValue = true;
      this.editModeActive = true;
      this.mode = 'create';
    }
  }

  activateEditMode() {
    this.editModeActive = true;
    this.mode = 'update';
  }

  saveEditValue() {
    console.log('edit displayValue: ', this.displayValue);
    this.editModeActive = false;
    const updatedVal = this.displayValueComponent.getUpdatedValue();

    if (updatedVal instanceof UpdateValue) {

      const updateRes = new UpdateResource();
      updateRes.id = this.parentResource.id;
      updateRes.type = this.parentResource.type;
      updateRes.property = this.displayValue.property;
      updateRes.value = updatedVal;
      this.knoraApiConnection.v2.values.updateValue(updateRes as UpdateResource<UpdateValue>).pipe(
        mergeMap((res: WriteValueResponse) => {
          return this.knoraApiConnection.v2.values.getValue(this.parentResource.id, res.uuid);
        })
      ).subscribe(
        (res2: ReadResource) => {
          this.displayValue = res2.getValues(this.displayValue.property)[0];
          this.mode = 'read';
        }
      );

    } else {
      console.error('invalid value');
    }
  }

  cancelEditValue() {
    this.editModeActive = false;
    this.mode = 'read';
  }

  saveCreateValue() {
    this.valueCreated.emit('message to parent');
  }

  // saveCreateValue() {
  //   this.editModeActive = false;
  //   const createVal = this.displayValueComponent.getNewValue();
  //   // console.log('createVal: ', createVal);
    

  //   if (createVal instanceof CreateValue) {
  //     // console.log('create displayValue: ', this.displayValue);
      
  //     const updateRes = new UpdateResource();
  //     updateRes.id = this.parentResource.id;
  //     updateRes.type = this.parentResource.type;
  //     updateRes.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText';
  //     updateRes.value = createVal;

  //     // console.log('updateRes: ', updateRes);
      
  //     this.knoraApiConnection.v2.values.createValue(updateRes as UpdateResource<CreateValue>).pipe(
  //       mergeMap((res: WriteValueResponse) => {
  //         // console.log(res);
  //         return this.knoraApiConnection.v2.values.getValue(this.parentResource.id, res.uuid);
  //       })
  //       ).subscribe(
  //         (res2: ReadResource) => {
  //           // console.log(this.parentResource);
  //           this.mode = 'read';
  //           console.log('bopity boopity');
            
  //           this.valueCreated.emit(true);
  //         }
  //       );

  //   } else {
  //     console.error('invalid value');
  //   }
  // }

  deleteValue() {
    const deleteVal = new DeleteValue();
    deleteVal.id = this.displayValue.id;
    deleteVal.type = this.displayValue.type;

    const updateRes = new UpdateResource();
    updateRes.type = this.parentResource.type;
    updateRes.id = this.parentResource.id;
    updateRes.property = this.displayValue.property;
    updateRes.value = deleteVal;

    console.log('updateRes: ', updateRes);

    this.knoraApiConnection.v2.values.deleteValue(updateRes as UpdateResource<DeleteValue>).pipe(
      mergeMap((res: DeleteValueResponse) => {
        console.log('res: ', res);
        return res.result;
      })
    ).subscribe(
      () => {
        //console.log('res2: ', res2);
        //this.displayValue = res2.getValues(this.displayValue.property)[0];
        //this.mode = 'read';
      }
    );  
  }

}
