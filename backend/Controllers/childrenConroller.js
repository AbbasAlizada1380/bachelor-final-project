import Children from '../Models/children.js';

export const getAllChildren = async (req, res) => {
  try {
    const children = await Children.findAll();
    res.status(200).json(children);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChildById = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await Children.findByPk(id);
    if (child) {
      res.status(200).json(child);
    } else {
      res.status(404).json({ error: 'Child not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createChild = async (req, res) => {
  try {
    const { Name, lastName, gender, birthDate, birthPlace, parentId } = req.body;
    const child = await Children.create({ Name, lastName, gender, birthDate, birthPlace, parentId });
    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, lastName, gender, birthDate, birthPlace, parentId } = req.body;
    const [updated] = await Children.update({ Name, lastName, gender, birthDate, birthPlace, parentId }, {
      where: { id }
    });
    if (updated) {
      const updatedChild = await Children.findByPk(id);
      res.status(200).json(updatedChild);
    } else {
      res.status(404).json({ error: 'Child not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteChild = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Children.destroy({
      where: { id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Child not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
