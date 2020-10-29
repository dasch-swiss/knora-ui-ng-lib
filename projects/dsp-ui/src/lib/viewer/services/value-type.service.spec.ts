import { TestBed } from '@angular/core/testing';

import {
    KnoraDate,
    MockResource, ReadDateValue,
    ReadIntValue,
    ReadTextValueAsHtml,
    ReadTextValueAsString,
    ReadTextValueAsXml
} from '@dasch-swiss/dsp-js';
import { ValueTypeService } from './value-type.service';

describe('ValueTypeService', () => {
    let service: ValueTypeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ValueTypeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getValueTypeOrClass', () => {

        it('should return type of int', () => {
            const readIntValue = new ReadIntValue();
            readIntValue.type = 'http://api.knora.org/ontology/knora-api/v2#IntValue';
            expect(service.getValueTypeOrClass(readIntValue)).toEqual('http://api.knora.org/ontology/knora-api/v2#IntValue');
        });

        it('should return class of ReadTextValueAsString', () => {
            const readTextValueAsString = new ReadTextValueAsString();
            readTextValueAsString.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            expect(service.getValueTypeOrClass(readTextValueAsString)).toEqual('ReadTextValueAsString');
        });
    });

    describe('isReadOnly', () => {

        it('should not mark ReadTextValueAsString as ReadOnly', () => {
            const readTextValueAsString = new ReadTextValueAsString();
            readTextValueAsString.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            const valueClass = service.getValueTypeOrClass(readTextValueAsString);
            expect(service.isReadOnly(valueClass, readTextValueAsString)).toBeFalsy();
        });

        it('should mark ReadTextValueAsHtml as ReadOnly', () => {
            const readTextValueAsHtml = new ReadTextValueAsHtml();
            readTextValueAsHtml.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            const valueClass = service.getValueTypeOrClass(readTextValueAsHtml);
            expect(service.isReadOnly(valueClass, readTextValueAsHtml)).toBeTruthy();
        });

        it('should not mark ReadTextValueAsXml with standard mapping as ReadOnly', () => {
            const readTextValueAsXml = new ReadTextValueAsXml();
            readTextValueAsXml.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            readTextValueAsXml.mapping = 'http://rdfh.ch/standoff/mappings/StandardMapping';
            const valueClass = service.getValueTypeOrClass(readTextValueAsXml);
            expect(service.isReadOnly(valueClass, readTextValueAsXml)).toBeFalsy();
        });

        it('should mark ReadTextValueAsXml with custom mapping as ReadOnly', () => {
            const readTextValueAsXml = new ReadTextValueAsXml();
            readTextValueAsXml.type = 'http://api.knora.org/ontology/knora-api/v2#TextValue';
            readTextValueAsXml.mapping = 'http://rdfh.ch/standoff/mappings/CustomMapping';
            const valueClass = service.getValueTypeOrClass(readTextValueAsXml);
            expect(service.isReadOnly(valueClass, readTextValueAsXml)).toBeTruthy();
        });

        it('should mark ReadDateValue with unsupported era as ReadOnly', done => {

            MockResource.getTestthing().subscribe(res => {
                const date: ReadDateValue =
                    res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate', ReadDateValue)[0];

                date.date = new KnoraDate('GREGORIAN', 'BCE', 2019, 5, 13);

                const valueClass = service.getValueTypeOrClass(date);
                expect(service.isReadOnly(valueClass, date)).toBeTruthy();

                done();

            });

        });

        it('should not mark ReadDateValue with supported era as ReadOnly', done => {

            MockResource.getTestthing().subscribe(res => {
                const date: ReadDateValue =
                    res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate', ReadDateValue)[0];

                date.date = new KnoraDate('GREGORIAN', 'CE', 2019, 5, 13);

                const valueClass = service.getValueTypeOrClass(date);
                expect(service.isReadOnly(valueClass, date)).toBeFalsy();

                done();

            });

        });

        it('should mark ReadDateValue with unsupported precision as ReadOnly', done => {

            MockResource.getTestthing().subscribe(res => {
                const date: ReadDateValue =
                    res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate', ReadDateValue)[0];

                date.date = new KnoraDate('GREGORIAN', 'CE', 2019, 5);

                const valueClass = service.getValueTypeOrClass(date);
                expect(service.isReadOnly(valueClass, date)).toBeTruthy();

                done();

            });

        });

        it('should not mark ReadDateValue with supported precision as ReadOnly', done => {

            MockResource.getTestthing().subscribe(res => {
                const date: ReadDateValue =
                    res.getValuesAs('http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate', ReadDateValue)[0];

                date.date = new KnoraDate('GREGORIAN', 'CE', 2019, 5, 1);

                const valueClass = service.getValueTypeOrClass(date);
                expect(service.isReadOnly(valueClass, date)).toBeFalsy();

                done();

            });

        });

    });

    describe('compareObjectTypeWithValueType', () => {

        it('should successfully compare "http://api.knora.org/ontology/knora-api/v2#TextValue" with "ReadTextValueAsString"', () => {
            expect(service.compareObjectTypeWithValueType(
                'ReadTextValueAsString',
                'http://api.knora.org/ontology/knora-api/v2#TextValue'))
                .toBeTruthy();
        });

        it('should successfully compare "http://api.knora.org/ontology/knora-api/v2#TextValue" with "ReadTextValueAsHtml"', () => {
            expect(service.compareObjectTypeWithValueType(
                'ReadTextValueAsHtml',
                'http://api.knora.org/ontology/knora-api/v2#TextValue'))
                .toBeTruthy();
        });

        it('should successfully compare "http://api.knora.org/ontology/knora-api/v2#TextValue" with "ReadTextValueAsXml"', () => {
            expect(service.compareObjectTypeWithValueType(
                'ReadTextValueAsXml',
                'http://api.knora.org/ontology/knora-api/v2#TextValue'))
                .toBeTruthy();
        });

        it('should successfully compare "http://api.knora.org/ontology/knora-api/v2#IntValue" with "http://api.knora.org/ontology/knora-api/v2#IntValue"', () => {
            expect(service.compareObjectTypeWithValueType(
                'http://api.knora.org/ontology/knora-api/v2#IntValue',
                'http://api.knora.org/ontology/knora-api/v2#IntValue'))
                .toBeTruthy();
        });

        it('should fail to compare an IntValue with a DecimalValue', () => {
            expect(service.compareObjectTypeWithValueType(
                'http://api.knora.org/ontology/knora-api/v2#IntValue',
                'http://api.knora.org/ontology/knora-api/v2#DecimalValue'))
                .toBeFalsy();
        })

        it('should fail to compare "http://api.knora.org/ontology/knora-api/v2#IntValue" with "ReadTextValueAsString"', () => {
            expect(service.compareObjectTypeWithValueType(
                'ReadTextValueAsString',
                'http://api.knora.org/ontology/knora-api/v2#IntValue'))
                .toBeFalsy();
        });

    });
});
