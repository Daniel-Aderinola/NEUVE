import { Request, Response } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { mockProducts, mockCategories } from '../mockData';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };

    // Category filter
    if (req.query.category) filter.category = req.query.category;

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Size filter
    if (req.query.size) filter.sizes = { $in: (req.query.size as string).split(',') };

    // Search
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    // Featured filter
    if (req.query.featured) filter.featured = req.query.featured === 'true';

    // Sort
    let sort: any = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    else if (req.query.sort === 'price-desc') sort = { price: -1 };
    else if (req.query.sort === 'newest') sort = { createdAt: -1 };
    else if (req.query.sort === 'rating') sort = { rating: -1 };

    try {
      const products = await Product.find(filter)
        .populate('category', 'name slug')
        .skip(skip)
        .limit(limit)
        .sort(sort);

      const total = await Product.countDocuments(filter);

      res.json({
        products,
        page,
        pages: Math.ceil(total / limit),
        total,
      });
    } catch (dbError: any) {
      console.log('Database unavailable, using mock data');
      // Fallback to mock data
      let filtered = [...mockProducts];

      // Apply featured filter
      if (req.query.featured === 'true') {
        filtered = filtered.filter(p => p.featured);
      }

      // Apply search
      if (req.query.search) {
        const searchTerm = (req.query.search as string).toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        );
      }

      // Apply price filter
      if (req.query.minPrice) {
        filtered = filtered.filter(p => p.price >= Number(req.query.minPrice));
      }
      if (req.query.maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(req.query.maxPrice));
      }

      const total = filtered.length;
      const products = filtered.slice(skip, skip + limit);

      res.json({
        products,
        page,
        pages: Math.ceil(total / limit),
        total,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort('-createdAt');
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .populate('category', 'name slug')
      .limit(4);

    res.json(relatedProducts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Create product
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update product
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete product
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all products (including inactive)
export const adminGetProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .populate('category', 'name slug')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await Product.countDocuments();

    res.json({ products, page, pages: Math.ceil(total / limit), total });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
