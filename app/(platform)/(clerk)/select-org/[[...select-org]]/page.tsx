import { OrganizationList } from "@clerk/nextjs";

function SelectOrgPage() {
    return (<OrganizationList
        hidePersonal
        afterSelectOrganizationUrl="/organization/:id"
        afterCreateOrganizationUrl="/organization/:id"
    />);
}

export default SelectOrgPage;