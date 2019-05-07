import React from 'react';
import ReactDOM from 'react-dom';
import CRUDTable,
{
    Fields,
    Field,
    CreateForm,
    UpdateForm,
    DeleteForm,
} from 'react-crud-table';

// Component's Base CSS
import './index.css';

const CategoryRenderer = ({ field }) => <textarea {...field} />;

let products = [
    {
        id: 1,
        name: 'Create an example',
        category: 'Create an example of how to use the component',
        price: '20',
        date: '15/2/2018'
    },
    {
        id: 2,
        name: 'Improve',
        category: 'Improve the component!',
        price: '50',
        date: '23/2/2018'
    },
];

const SORTERS = {
    NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
    NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
    STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
    STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a)),
};

const getSorter = (data) => {
    const mapper = x => x[data.field];
    let sorter = SORTERS.STRING_ASCENDING(mapper);

    if (data.field === 'id') {
        sorter = data.direction === 'ascending' ?
            SORTERS.NUMBER_ASCENDING(mapper) : SORTERS.NUMBER_DESCENDING(mapper);
    } else {
        sorter = data.direction === 'ascending' ?
            SORTERS.STRING_ASCENDING(mapper) : SORTERS.STRING_DESCENDING(mapper);
    }

    return sorter;
};


let count = products.length;
const service = {
    fetchItems: (payload) => {
        let result = Array.from(products);
        result = result.sort(getSorter(payload.sort));
        return Promise.resolve(result);
    },
    create: (product) => {
        count += 1;
        products.push({
            ...product,
            id: count,
        });
        return Promise.resolve(product);
    },
    update: (data) => {
        const product = products.find(t => t.id === data.id);
        product.name = data.name;
        product.category = data.category;
        product.price = data.price;
        product.date = data.date;
        return Promise.resolve(product);
    },
    delete: (data) => {
        const product = products.find(t => t.id === data.id);
        products = products.filter(t => t.id !== product.id);
        return Promise.resolve(product);
    },
};

const styles = {
    container: { margin: 'auto', width: 'fit-content' },
};

const Example = () => (
    <div style={styles.container}>
        <CRUDTable
            caption="Products List"
            fetchItems={payload => service.fetchItems(payload)}
        >
            <Fields>
                <Field
                    name="id"
                    label="Id"
                    hideInCreateForm
                    hideInUpdateForm
                />
                <Field
                    name="name"
                    label="Name"
                    placeholder="name"
                />
                <Field
                    name="category"
                    label="Category"
                    render={CategoryRenderer}
                />
                <Field
                    name="price"
                    label="Price ($)"
                    render={CategoryRenderer}
                />

                <Field
                    name="date"
                    label="Created Date"
                    hideInCreateForm
                    hideInUpdateForm
                />
            </Fields>
            <CreateForm
                name="Add Product"
                message="Add a new product!"
                trigger="Add Product"
                onSubmit={product => service.create(product)}
                submitText="Create"
                validate={(values) => {
                    const errors = {};
                    if (!values.name) {
                        errors.name = 'Please, provide product\'s name';
                    }

                    if (!values.category) {
                        errors.category = 'Please, provide product\'s category';
                    }

                    if (!values.price || values.price <= 0) {
                        errors.name = 'Please, provide a positive product\'s price';
                    }
                    
                    return errors;
                }}
            />

            <UpdateForm
                name="product Update Process"
                message="Update product"
                trigger="Update"
                onSubmit={product => service.update(product)}
                submitText="Update"
                validate={(values) => {
                    const errors = {};

                    if (!values.name) {
                        errors.name = 'Please, provide product\'s name';
                    }

                    if (!values.category) {
                        errors.category = 'Please, provide product\'s category';
                    }

                    if (!values.price || values.price <= 0) {
                        errors.name = 'Please, provide a positive product\'s price';
                    }

                    return errors;
                }}
            />

            <DeleteForm
                name="Product Delete Process"
                message="Are you sure you want to delete the product?"
                trigger="Delete"
                onSubmit={product => service.delete(product)}
                submitText="Delete"
                validate={(values) => {
                    const errors = {};
                    if (!values.name) {
                        errors.id = 'Please, provide product name';
                    }
                    return errors;
                }}
            />
        </CRUDTable>
    </div>
);

Example.propTypes = {};

ReactDOM.render(
    <Example />,
    document.getElementById('root')
);
