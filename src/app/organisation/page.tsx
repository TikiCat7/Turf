import { auth, clerkClient } from "@clerk/nextjs";

const Organisation = async () => {
  const { orgId } = auth();
  console.log("orgId: ", orgId);

  const users = clerkClient.users;
  const org = clerkClient.organizations;
  const userCount = await users.getCount();
  const orgName = await org.getOrganization({ organizationId: orgId ?? "" });
  // try {
  //   const invite = await org.createOrganizationInvitation({
  //     organizationId: orgId ?? "",
  //     emailAddress: "wata1991@gmail.com",
  //     role: "basic_member",
  //     inviterUserId: userId ?? "",
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  const invitations =
    await clerkClient.organizations.getOrganizationInvitationList({
      organizationId: orgId ?? "",
    });

  // try {
  //   await clerkClient.organizations.revokeOrganizationInvitation({
  //     organizationId: orgId ?? "",
  //     invitationId: invitations[0].id,
  //     requestingUserId: userId ?? "",
  //   });
  //   console.log("revoked invitation: ", invitations[0].id);
  // } catch (e) {
  //   console.log(e);
  // }

  const { organization: authOrg } = auth();
  console.log("authOrg: ", authOrg);
  // console.log("memberships: ", memberships);
  return (
    <div>
      <div>User count: {userCount}</div>
      <div>Org name: {orgName.name}</div>
      <p>Pending Inviations</p>
      {invitations.map((invitation) => (
        <div key={invitation.createdAt}>
          <p>
            {invitation.emailAddress} - {invitation.status} - {invitation.id}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Organisation;
