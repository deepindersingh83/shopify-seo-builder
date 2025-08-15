import { Request, Response } from "express";
import { databaseService } from "../services/database";
import { z } from "zod";

// Validation schemas
const FilterPresetSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  filters: z.array(z.object({
    field: z.string(),
    operator: z.string(),
    value: z.any(),
    value2: z.any().optional(),
  })),
  isPublic: z.boolean().default(false),
  createdBy: z.string(),
});

const ApplyFiltersSchema = z.object({
  filters: z.array(z.object({
    field: z.string(),
    operator: z.string(),
    value: z.any(),
    value2: z.any().optional(),
  })),
  options: z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    sortBy: z.string().optional(),
    sortDirection: z.enum(["asc", "desc"]).optional(),
  }).optional(),
});

// In-memory storage for when database is not available
let inMemoryPresets: any[] = [];

// Get all filter presets
export const getFilterPresets = async (req: Request, res: Response) => {
  try {
    if (databaseService.isConnected()) {
      const presets = await databaseService.query(
        "SELECT * FROM filter_presets ORDER BY usage_count DESC, created_at DESC"
      );
      
      const parsedPresets = presets.map((preset: any) => ({
        ...preset,
        filters: preset.filters ? JSON.parse(preset.filters) : [],
      }));
      
      res.json(parsedPresets);
    } else {
      res.json(inMemoryPresets);
    }
  } catch (error) {
    console.error("Error fetching filter presets:", error);
    res.status(500).json({ error: "Failed to fetch filter presets" });
  }
};

// Get a specific filter preset
export const getFilterPreset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (databaseService.isConnected()) {
      const presets = await databaseService.query(
        "SELECT * FROM filter_presets WHERE id = ?",
        [id]
      );

      if (presets.length === 0) {
        return res.status(404).json({ error: "Filter preset not found" });
      }

      const preset = {
        ...presets[0],
        filters: presets[0].filters ? JSON.parse(presets[0].filters) : [],
      };

      res.json(preset);
    } else {
      const preset = inMemoryPresets.find(p => p.id === id);
      if (!preset) {
        return res.status(404).json({ error: "Filter preset not found" });
      }
      res.json(preset);
    }
  } catch (error) {
    console.error("Error fetching filter preset:", error);
    res.status(500).json({ error: "Failed to fetch filter preset" });
  }
};

// Create a new filter preset
export const createFilterPreset = async (req: Request, res: Response) => {
  try {
    const validatedData = FilterPresetSchema.parse(req.body);

    const newPreset = {
      id: `preset-${Date.now()}`,
      ...validatedData,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (databaseService.isConnected()) {
      await databaseService.query(
        `INSERT INTO filter_presets 
         (id, name, description, filters, is_public, created_by, usage_count, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newPreset.id,
          newPreset.name,
          newPreset.description || null,
          JSON.stringify(newPreset.filters),
          newPreset.isPublic,
          newPreset.createdBy,
          newPreset.usageCount,
          newPreset.createdAt,
        ]
      );
    } else {
      inMemoryPresets.push(newPreset);
    }

    res.status(201).json(newPreset);
  } catch (error) {
    console.error("Error creating filter preset:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request data", details: error.errors });
    } else {
      res.status(500).json({ error: "Failed to create filter preset" });
    }
  }
};

// Update a filter preset
export const updateFilterPreset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (databaseService.isConnected()) {
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id') {
          if (key === 'filters') {
            updateFields.push("filters = ?");
            updateValues.push(JSON.stringify(value));
          } else {
            updateFields.push(`${key} = ?`);
            updateValues.push(value);
          }
        }
      });

      if (updateFields.length > 0) {
        updateValues.push(id);
        await databaseService.query(
          `UPDATE filter_presets SET ${updateFields.join(", ")} WHERE id = ?`,
          updateValues
        );
      }

      const updated = await databaseService.query(
        "SELECT * FROM filter_presets WHERE id = ?",
        [id]
      );

      if (updated.length === 0) {
        return res.status(404).json({ error: "Filter preset not found" });
      }

      const preset = {
        ...updated[0],
        filters: updated[0].filters ? JSON.parse(updated[0].filters) : [],
      };

      res.json(preset);
    } else {
      const presetIndex = inMemoryPresets.findIndex(p => p.id === id);
      if (presetIndex === -1) {
        return res.status(404).json({ error: "Filter preset not found" });
      }

      inMemoryPresets[presetIndex] = {
        ...inMemoryPresets[presetIndex],
        ...updates,
      };

      res.json(inMemoryPresets[presetIndex]);
    }
  } catch (error) {
    console.error("Error updating filter preset:", error);
    res.status(500).json({ error: "Failed to update filter preset" });
  }
};

// Delete a filter preset
export const deleteFilterPreset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (databaseService.isConnected()) {
      const result = await databaseService.query(
        "DELETE FROM filter_presets WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Filter preset not found" });
      }
    } else {
      const presetIndex = inMemoryPresets.findIndex(p => p.id === id);
      if (presetIndex === -1) {
        return res.status(404).json({ error: "Filter preset not found" });
      }

      inMemoryPresets.splice(presetIndex, 1);
    }

    res.json({ success: true, message: "Filter preset deleted successfully" });
  } catch (error) {
    console.error("Error deleting filter preset:", error);
    res.status(500).json({ error: "Failed to delete filter preset" });
  }
};

// Apply filters to products
export const applyFilters = async (req: Request, res: Response) => {
  try {
    const validatedData = ApplyFiltersSchema.parse(req.body);
    const { filters, options = {} } = validatedData;

    // This would apply filters to products and return filtered results
    // For now, return empty results since we're removing mock data
    res.json({
      products: [],
      total: 0,
      facets: {},
      message: "No products found with current filters",
    });
  } catch (error) {
    console.error("Error applying filters:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request data", details: error.errors });
    } else {
      res.status(500).json({ error: "Failed to apply filters" });
    }
  }
};

// Get filter counts
export const getFilterCounts = async (req: Request, res: Response) => {
  try {
    // Return empty counts since we're removing mock data
    res.json({});
  } catch (error) {
    console.error("Error getting filter counts:", error);
    res.status(500).json({ error: "Failed to get filter counts" });
  }
};

// Get filter suggestions
export const getFilterSuggestions = async (req: Request, res: Response) => {
  try {
    // Return empty suggestions since we're removing mock data
    res.json([]);
  } catch (error) {
    console.error("Error getting filter suggestions:", error);
    res.status(500).json({ error: "Failed to get filter suggestions" });
  }
};

// Validate filter
export const validateFilter = async (req: Request, res: Response) => {
  try {
    const { filter } = req.body;

    // Basic validation
    if (!filter.field || !filter.operator) {
      return res.json({
        valid: false,
        error: "Filter must have field and operator",
      });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error("Error validating filter:", error);
    res.status(500).json({ error: "Failed to validate filter" });
  }
};

// Preview filter results
export const previewFilterResults = async (req: Request, res: Response) => {
  try {
    // Return empty preview since we're removing mock data
    res.json([]);
  } catch (error) {
    console.error("Error previewing filter results:", error);
    res.status(500).json({ error: "Failed to preview filter results" });
  }
};

// Duplicate a filter preset
export const duplicateFilterPreset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "New name is required" });
    }

    let originalPreset;

    if (databaseService.isConnected()) {
      const presets = await databaseService.query(
        "SELECT * FROM filter_presets WHERE id = ?",
        [id]
      );

      if (presets.length === 0) {
        return res.status(404).json({ error: "Filter preset not found" });
      }

      originalPreset = {
        ...presets[0],
        filters: presets[0].filters ? JSON.parse(presets[0].filters) : [],
      };
    } else {
      originalPreset = inMemoryPresets.find(p => p.id === id);
      if (!originalPreset) {
        return res.status(404).json({ error: "Filter preset not found" });
      }
    }

    const duplicatedPreset = {
      ...originalPreset,
      id: `preset-${Date.now()}`,
      name,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (databaseService.isConnected()) {
      await databaseService.query(
        `INSERT INTO filter_presets 
         (id, name, description, filters, is_public, created_by, usage_count, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          duplicatedPreset.id,
          duplicatedPreset.name,
          duplicatedPreset.description || null,
          JSON.stringify(duplicatedPreset.filters),
          duplicatedPreset.isPublic,
          duplicatedPreset.createdBy,
          duplicatedPreset.usageCount,
          duplicatedPreset.createdAt,
        ]
      );
    } else {
      inMemoryPresets.push(duplicatedPreset);
    }

    res.status(201).json(duplicatedPreset);
  } catch (error) {
    console.error("Error duplicating filter preset:", error);
    res.status(500).json({ error: "Failed to duplicate filter preset" });
  }
};
