import Appointment from '../Models/appointment.js';
import records from '../Models/records.js';
import Op, { Sequelize } from 'sequelize'


//function to get one appointment based on id

export const getAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findOne({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'No appointment found for thisid' });
    }

    return res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
  }
};

//functions for reporting

const getTimeRangeCondition = (timeRange) => {
  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  switch (timeRange) {
    case 'today':
      return {
        updatedAt: {
          [Op.gte]: startOfToday,
        },
      };
    case 'week':
      return {
        appointmentTime: {
          [Op.gte]: startOfWeek,
        },
      };
    case 'month':
      return {
        appointmentTime: {
          [Op.gte]: startOfMonth,
        },
      };
    default:
      return {};
  }
};

export const getAppointmentReport = async (req, res) => {
  // const { timeRange } = req.query;

  try {
    // const condition = getTimeRangeCondition(timeRange);

    const pendingCount = await Appointment.count({
      where: {
        // ...condition,
        state: 'pending',
      },
    });

    const processingCount = await Appointment.count({
      where: {
        // ...condition,
        state: 'processing',
      },
    });

    const doneCount = await Appointment.count({
      where: {
        // ...condition,
        state: 'done',
      },
    });

    res.json({
      pending: pendingCount,
      processing: processingCount,
      done: doneCount,
    });

  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Controller function to handle appointment search by name, mode, and NIC
export const searchBySpecification = async (req, res) => {
  const { name, mode, NIC } = req.body;

  try {
    //validation
    if (!name || !mode || !NIC) {
      return res.status(400).json({ message: 'All fields are required', });
    }
    // Find the record in the records table
    const record = await records.findOne({
      where: {
        Name: name,
        mode: mode,
        NIC: NIC
      },
      attributes: ['coupleId']
    });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    // Find the appointment using the retrieved id
    const appointment = await Appointment.findOne({
      where: { id: record.coupleId },
      attributes: ['state', 'appointmentTime', 'familyCode', 'zone']
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    return res.json({
      state: appointment.state,
      appointmentTime: appointment.appointmentTime,
      id: record.coupleId,
      familyCode: appointment.familyCode,
      zone: appointment.zone,
    });
  } catch (error) {
    console.error('Error fetching appointment by specification:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createAppointment = (req, res) => {

}
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Controller function to handle appointment search by family code
export const searchByFamilyCode = async (req, res) => {
  const { familyCode } = req.body;

  try {
    const appointment = await Appointment.findOne({
      where: { familyCode }
    });
    if (!appointment) {
      return res.status(404).json({ massage: "not found" });
    }

    return res.json({
      state: appointment.state,
      appointmentTime: appointment.appointmentTime,
      id: appointment.id,
      familyCode: appointment.familyCode,
      zone: appointment.zone
    });
  } catch (error) {
    console.error('Error fetching appointment by family code:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
export const updateAppointments = async (req, res) => {
  const { amount, zone } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount specified' });
  }

  try {
    const appointments = await Appointment.findAll({
      where: { state: 'pending', zone: zone },
      order: [['id', 'ASC']],
      limit: parseInt(amount, 10)
    });

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No pending appointments found' });
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2); // Day after tomorrow

    const updatePromises = appointments.map(appointment =>
      appointment.update({
        appointmentTime: tomorrow,
        state: 'processing'
      })
    );

    await Promise.all(updatePromises);

    res.json({ message: `${appointments.length} appointments updated successfully` });
  } catch (error) {
    console.error('Error updating appointments:', error);
    res.status(500).json({ error: 'An error occurred while updating appointments' });
  }
};
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Appointment.destroy({
      where: { id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportData = async (req, res) => {
  const { zone, timeRange } = req.body;

  const date = new Date();
  let startDate;

  // Calculate the start date based on the time range
  switch (timeRange) {
    case 'daily':
      startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      break;
    case 'weekly':
      startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
      break;
    case 'monthly':
      startDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
      break;
    default:
      return res.status(400).json({ error: 'Invalid time range' });
  }

  // Format the start date to 'YYYY-MM-DD HH:MM:SS'
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const formattedStartDate = formatDate(startDate);

  try {
    // Logging startDate for debugging
    console.log(`Formatted Start Date: ${formattedStartDate}`);

    // Fetch count of pending appointments
    const pendingCount = await Appointment.count({
      where: {
        zone: zone,
        state: 'pending',
        // createdAt: {
        //   [Op.gte]: startDate
        //   ,
        // },
      },
    });

    // Fetch count of processing appointments
    const processingCount = await Appointment.count({
      where: {
        zone: zone,
        state: 'processing',
        // Uncomment and use the appropriate field if necessary
        // appointmentTime: {
        //   [Op.gt]: formattedStartDate

        // },
      },
    });

    // Fetch count of done appointments
    const doneCount = await Appointment.count({
      where: {
        zone: zone,
        state: 'done',
        // Uncomment and use the appropriate field if necessary
        // updatedAt: {
        //   [Op.gt]: formattedStartDate

        // },
      },
    });

    // Logging counts for debugging
    console.log(`Pending: ${pendingCount}, Processing: ${processingCount}, Done: ${doneCount}`);

    // Sending the response with the counts
    res.json({ pending: pendingCount, processing: processingCount, done: doneCount });
  } catch (error) {
    // Logging the error
    console.error('Error fetching report data:', error);
    res.status(500).json({ error: 'An error occurred while fetching report data' });
  }
};