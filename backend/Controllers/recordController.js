import records from "../Models/records.js";
import Appointment from "../Models/appointment.js";
import cron from "node-cron";
import sequelize from "../dbconnection.js";
import appointment from "../Models/appointment.js";
import Children from '../Models/children.js'


export const getRecords = async (req, res) => {
  const { id } = req.body;

  try {
    const record = await records.findAll({
      where: {
        coupleId:id,
        mode:['شوهر','خانم'],
      },
    });

    if (record.length === 0) {
      return res.status(404).json({ message: 'No records found.' });
    }

    res.status(200).json(record);
    console.log(record);
  } catch (error) {
    console.error('Error searching records:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const changeState=async (req,res)=>{
const {Name, NIC, mode}=req.body;
try{
const response=await records.findOne({where:{Name, NIC,mode}});
if(!response){
return res.status(404).json({message:"Record not found"});
}
const couplId=response.coupleId;
const state='done';

//update the record
const appointment=await Appointment.update({state:state},{where:{id:couplId}})
if(appointment[0]===0){
return res.status(404).json({message:"Appointment not found"});
}
res.json({massage:"mode changed"})

}catch{

}
}
//function to find the record of family

export const findFamily = async (req, res) => {
  const { Name, NIC, mode } = req.body;

  try {
    // Find the record with the provided Name, NIC, and mode
    const h_record = await records.findOne({ where: { name: Name, NIC, mode } });

    if (!h_record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const coupleId = h_record.coupleId;

    // Find records with the same coupleId where mode is 'خانم' or 'شاهد'
    const w_record = await records.findOne({
      where: {
        coupleId,
        mode: 'خانم'
      }
    });

    const wit_record = await records.findAll({
      where: {
        coupleId,
        mode: 'شاهد'
      }
    });

    const children = await Children.findAll({
      where: { parentId: coupleId }
    });

    res.status(200).json({
      husband: {
        name: h_record.Name,
        fatherName: h_record.fatherName,
        NIC: h_record.NIC,
        mode: h_record.mode,
      },
      wife: w_record ? {
        name: w_record.Name,
        fatherName: w_record.fatherName,
        NIC: w_record.NIC,
        mode: w_record.mode,
      } : null,
      witnesses: wit_record.length > 0 ? wit_record.map(wit => ({
        name: wit.Name,
        fatherName: wit.fatherName,
        NIC: wit.NIC,
        mode: wit.mode
      })) : null,
      children: children.length > 0 ? children.map(child => ({
        name: child.Name,
        fatherName:h_record.Name,
        birthDate: child.birthDate,
        NIC: child.NIC
      })) : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//find all records
export const getAllRecords = async (req, res) => {
  try {
    const record = await records.findAll();
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//find a single record
export const getRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await records.findByPk(id);
    if (record) {
      res.status(200).json(record);
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//inserting record of witness

export const insertRecord = async (req, res) => {
  const {
    Name,
    lastName,
    fatherName,
    GfatherName,
    gender,
    birthDate,
    birthPlace,
    residency,
    NIC,
    nation,
    religion,
    coupleId,
    district
  } = req.body;

  try {
    const newRecord = await records.create({
      Name,
      lastName,
      fatherName,
      GfatherName,
      gender,
      birthDate,
      birthPlace,
      residency,
      NIC,
      nation,
      religion,
      coupleId,
      district,
      mode: 'شاهد'
    });

    res.status(201).json({
      message: `Record created successfully by id`,
      data: newRecord
    });
  } catch (error) {
    console.error('Error inserting record:', error);
    res.status(500).json({
      message: 'Error creating record',
      error: error.message
    });
  }
};


//create a new record
export const createRecord = async (req, res) => {
  try {
    const { husbandData, wifeData,zoneNumber } = req.body;
   

    //  first we should enter data to the appointment table
    const appointment = await Appointment.create({
      familyCode: new Date().getTime().toString().slice(7, 13),
      state: "pending",
      zone:zoneNumber,
    });
    let family_id = appointment.id;
    let familyCode = appointment.familyCode;


    sequelize.transaction(async (t) => {
      await records.create(
        {
          Name: husbandData.Name,
          lastName: husbandData.lastName,
          fatherName: husbandData.fatherName,
          GfatherName: husbandData.GfatherName,
          gender: husbandData.gender,
          birthDate: husbandData.birthDate,
          birthPlace: husbandData.birthPlace,
          residency: husbandData.residency,
          NIC: husbandData.NIC,
          nation: husbandData.nation,
          religion: husbandData.religion,
          mode: husbandData.mode,
          coupleId: family_id,
        },
        { transaction: t }
      );
      await records.create(
        {
          Name: wifeData.Name,
          lastName: wifeData.lastName,
          fatherName: wifeData.fatherName,
          GfatherName: wifeData.GfatherName,
          gender: wifeData.gender,
          birthDate: wifeData.birthDate,
          birthPlace: wifeData.birthPlace,
          residency: wifeData.residency,
          NIC: wifeData.NIC,
          nation: wifeData.nation,
          religion: wifeData.religion,
          mode: wifeData.mode,
          coupleId: family_id,
        },
        { transaction: t }
      );
    });

    res.status(201).json({ familyCode: familyCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// to update a record

export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Name,
      lastName,
      fatherName,
      GfatherName,
      gender,
      birthDate,
      birthPlace,
      residency,
      NIC,
      nation,
      religion,
      mode,
      coupleId,
    } = req.body;
    const [updated] = await records.update(
      {
        Name,
        lastName,
        fatherName,
        GfatherName,
        gender,
        birthDate,
        birthPlace,
        residency,
        NIC,
        nation,
        religion,
        mode,
        coupleId,
      },
      {
        where: { id },
      }
    );
    if (updated) {
      const updatedRecord = await records.findByPk(id);
      res.status(200).json(updatedRecord);
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//to delete a record
export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await records.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
