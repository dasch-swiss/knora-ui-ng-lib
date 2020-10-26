import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[dspDragDrop]'
})
export class DragDropDirective {

    @HostBinding('style.background-color') background = '#f2f2f2';

    @Output() fileDropped = new EventEmitter<any>();

    @HostListener('dragover', ['$event']) onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.background = '#ddd';
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.background = '#f2f2f2';
    }

    @HostListener('drop', ['$event']) onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.background = '#f2f2f2';
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.fileDropped.emit(files);
            console.log(`Dropped ${files.length} files.`, files);
        }
    }
}
