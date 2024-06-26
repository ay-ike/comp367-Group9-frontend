import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Product, ProductsService } from '@toys-hub/products';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-products-form',
    templateUrl: './products-form.component.html',
    styles: []
})
export class ProductsFormComponent implements OnInit {
    editmode = false;
    form: FormGroup;
    isSubmitted = false;
    categories = [];
    imageDisplay: string | ArrayBuffer;
    currentProductId: string;
    endsubs$: Subject<any> = new Subject();
    private selectedFiles: File[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private productsService: ProductsService,
        private categoriesService: CategoriesService,
        private messageService: MessageService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._initForm();
        this._getCategories();
        this._checkEditMode();
    }

    ngOnDestroy() {
        this.endsubs$.next();
        this.endsubs$.complete();
    }
    onCancel() {
        this.location.back();
    }
    private _initForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            brand: ['', Validators.required],
            price: ['', Validators.required],
            category: ['', Validators.required],
            countInStock: ['', Validators.required],
            description: ['', Validators.required],
            richDescription: [''],
            image: ['', Validators.required],
            isFeatured: [false]
        });
    }

    private _getCategories() {
        this.categoriesService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((categories) => {
                this.categories = categories;
            });
    }

    private _addProduct(productData: FormData) {
        this.productsService
            .createProduct(productData)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (product: Product) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Product ${product.name} is created!`
                    });
                    timer(2000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Product is not created!'
                    });
                }
            );
    }

    private _updateProduct(productFormData: FormData) {
        this.productsService
            .updateProduct(productFormData, this.currentProductId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Product is updated!'
                    });
                    timer(2000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Product is not updated!'
                    });
                }
            );
    }

    private _checkEditMode() {
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            if (params.id) {
                this.editmode = true;
                this.currentProductId = params.id;
                this.productsService
                    .getProduct(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((product) => {
                        this.productForm.name.setValue(product.name);
                        this.productForm.category.setValue(product.category.id);
                        this.productForm.brand.setValue(product.brand);
                        this.productForm.price.setValue(product.price);
                        this.productForm.countInStock.setValue(product.countInStock);
                        this.productForm.isFeatured.setValue(product.isFeatured);
                        this.productForm.description.setValue(product.description);
                        this.productForm.richDescription.setValue(product.richDescription);
                        this.imageDisplay = product.image;
                        this.productForm.image.setValidators([]);
                        this.productForm.image.updateValueAndValidity();
                    });
            }
        });
    }

    uploadGalleryImages() {
        const formData = new FormData();
        if (this.selectedFiles.length > 0) {
            Array.from(this.selectedFiles).forEach((file) => {
                formData.append('images', file);
            });
            this.productsService.updateProductImages(this.currentProductId, formData).subscribe({
                next: (response) => {
                    console.log('Gallery images uploaded successfully');
                },
                error: (error) => {
                    console.error('Error uploading gallery images', error);
                }
            });
        } else {
            console.log('No images selected for upload');
        }
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) return;
        const productFormData = new FormData();
        Object.keys(this.productForm).map((key) => {
            productFormData.append(key, this.productForm[key].value);
        });
        if (this.editmode) {
            this._updateProduct(productFormData);
            this.uploadGalleryImages();
        } else {
            this._addProduct(productFormData);
            this.uploadGalleryImages();
        }
    }
    onCancle() {}

    onImageUpload(event) {
        const file = event.target.files[0];
        this.selectedFiles = event.target.files;
        if (file) {
            this.form.patchValue({ image: file });
            this.form.get('image').updateValueAndValidity();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(file);
        }
    }

    get productForm() {
        return this.form.controls;
    }
}
