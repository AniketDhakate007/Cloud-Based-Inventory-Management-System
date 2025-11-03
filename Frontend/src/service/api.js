import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE_URL = 'https://zx991pwv31.execute-api.eu-north-1.amazonaws.com/dev';

// Helper to get auth token
async function getAuthToken() {
    try {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString();
    } catch (err) {
        console.error('Not authenticated', err);
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
    return res.json();
}

// POST - Add product
export async function addProduct(product) {
    const token = await getAuthToken();
    const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
        body: JSON.stringify(product),
    });
    return res.json();
}

// PUT - Update product
export async function updateProduct(productId, updates) {
    const token = await getAuthToken();
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
        body: JSON.stringify(updates),
    });
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
    return res.json();
}
