import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

const API_BASE_URL = 'https://zx991pwv31.execute-api.eu-north-1.amazonaws.com/dev';


async function getAuthToken() {
    try {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString();
    } catch (err) {
        console.error('Not authenticated', err);
        return null;
    }
}

async function getUserId() {
    try {
        const user = await getCurrentUser();
        return user.username;
    } catch (err) {
        console.error('Could not get user', err);
        return null;
    }
}

// GET all products for a shop
export async function getProducts(shopId) {
    const token = await getAuthToken();
    const res = await fetch(`${API_BASE_URL}/products?shopId=${shopId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

// POST - Add product
export async function addProduct(product) {
    const token = await getAuthToken();
    console.log('Adding product:', product);
    console.log('API URL:', `${API_BASE_URL}/products`);
    console.log('Token:', token ? 'Present' : 'Missing');

    try {
        const res = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token || '',
            },
            body: JSON.stringify(product),
        });

        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Response data:', data);

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
        return data;
    } catch (err) {
        console.error('Add product error:', err);
        throw err;
    }
}


// PUT - Update product
export async function updateProduct(productId, shopId, updates) {
    const token = await getAuthToken();
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
        body: JSON.stringify({ ...updates, shopId }),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
}

// DELETE - Delete product
export async function deleteProduct(productId, shopId) {
    const token = await getAuthToken();
    const res = await fetch(`${API_BASE_URL}/products/${productId}?shopId=${shopId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
}
