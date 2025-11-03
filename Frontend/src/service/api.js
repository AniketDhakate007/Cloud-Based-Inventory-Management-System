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
        return user.userId; // This is the Cognito 'sub' (user ID)
    } catch (err) {
        console.error('Could not get user', err);
        return null;
    }
}

// GET products for the logged-in user
export async function getProducts() {
    const userId = await getUserId();
    const token = await getAuthToken();

    const res = await fetch(`${API_BASE_URL}/products?shopId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
    });

    if (!res.ok) {
        console.error('Error fetching products:', await res.text());
        return [];
    }

    return res.json();
}

// POST - Add product
export async function addProduct(product) {
    const userId = await getUserId();
    const token = await getAuthToken();

    const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
        body: JSON.stringify({ ...product, shopId: userId }),
    });

    return res.json();
}

// DELETE product
export async function deleteProduct(productId) {
    const userId = await getUserId();
    const token = await getAuthToken();

    const res = await fetch(`${API_BASE_URL}/products/${productId}?shopId=${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
    });

    return res.json();
}

// PUT - Update product
export async function updateProduct(productId, updates) {
    const userId = await getUserId();
    const token = await getAuthToken();

    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token || '',
        },
        body: JSON.stringify({ ...updates, shopId: userId }),
    });

    return res.json();
}
