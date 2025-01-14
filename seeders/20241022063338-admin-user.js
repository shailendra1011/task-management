const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Insert a role into the 'roles' table
    await queryInterface.bulkInsert('roles', [
      {
        role_name: 'superadmin',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);

    // Retrieve the inserted role
    const role = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE role_name = 'superadmin' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const roleId = role[0].id;

    // 2. Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash('superadmin@gmail.com', 12);

    // 3. Insert a superadmin into the 'admins' table
    await queryInterface.bulkInsert('admins', [
      {
        name: 'Superadmin',
        email: 'superadmin@gmail.com',
        mobile: '1234567890',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);

    // Retrieve the inserted admin
    const admin = await queryInterface.sequelize.query(
      `SELECT id FROM admins WHERE email = 'superadmin@gmail.com' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const adminId = admin[0].id;

    // 4. Insert the admin-role mapping into the 'admin_roles' table
    await queryInterface.bulkInsert('admin_roles', [
      {
        admin_id: adminId,
        role_id: roleId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('admin_roles', { admin_id: 1 }, {});
    await queryInterface.bulkDelete('admins', { email: 'superadmin@gmail.com' }, {});
    await queryInterface.bulkDelete('roles', { role_name: 'superadmin' }, {});
  }
};
